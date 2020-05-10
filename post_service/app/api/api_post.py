from . import post
from flask import jsonify
from app.helper.Exception import CustomException
from flask import request
from app.models.post_model import Post
from app import db
from datetime import datetime, timedelta
from app.helper.Convert import DateTimeCnv
from flask_cors import cross_origin
from app.helper.auth_connector import verify_jwt
from app.helper.auth_connector import Permission
from app.helper.Connection import get_connection
from app.helper.ServiceURL import ServiceURL
from bs4 import BeautifulSoup
from markdown import markdown


@post.route('/test')
def test():
    raise CustomException('Test', 404)


@post.route('/<post_id>', methods=['GET'])
def get_post_by_id(post_id):
    post_current = Post.query.filter_by(post_id=post_id).first()
    with get_connection(post, name='profile') as conn:
        resp = conn.get(ServiceURL.PROFILE_SERVICE + '/user_profile?user_id=' + str(post_current.author_id))
        if resp.status_code != 200:
            raise CustomException('Cannot found post', 404)
    if post_current is None:
        raise CustomException('Cannot found post', 404)
    return jsonify(post_current.to_json_full(resp.json().get('name'), resp.json().get('avatar_hash'))), 200


@post.route('/', methods=['POST'])
@verify_jwt(blueprint=post, permissions=[Permission.WRITE])
def add_post():
    post_details = request.get_json()
    if post_details.get('author_id') is None:
        raise CustomException('You need to put author', 500)
    html = markdown(post_details.get('body'))
    text = '. '.join(BeautifulSoup(html).find_all(text=True))
    post_add = Post(title=post_details.get('title'),
                    body_html=post_details.get('body'),
                    body=text,
                    date_post=datetime.utcnow(),
                    body_summary=text[0:200] + '...',
                    author_id=post_details.get('author_id'))
    db.session.add(post_add)
    db.session.commit()
    return jsonify(post_add.to_json_summary(None, None)), 200


@post.route('/<post_id>', methods=['DELETE'])
def delete_post(post_id):
    post_del = Post.query.filter_by(post_id=post_id).first()
    if post_del is None:
        raise CustomException('Cannot found post', 404)
    db.session.delete(post_del)
    db.session.commit()
    return jsonify(post_del.to_json(None, None)), 200


@post.route('/', methods=['PUT'])
def update_post():
    post_details = request.get_json()
    query = Post.query.filter_by(post_id=post_details['post_id'])
    post_update = query.first()
    if post_update is None:
        raise CustomException('Cannot found post', 404)
    query.update(post_details)
    db.session.commit()
    return jsonify(post_update.to_json(None, None)), 200


@post.route('/get_all', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'])
def get_all_post_by_page():
    page = request.args.get('page') or '0'
    page = int(page)
    itemPerPage = request.args.get('items_per_page') or '20'
    itemPerPage = int(itemPerPage)
    type = int(request.args.get('type', '0'))
    req_from = request.args.get('from') or '2000-01-01 00:00:00'
    date_from = DateTimeCnv(req_from)
    req_to = request.args.get('to') or '3000-01-01 00:00:00'
    date_to = DateTimeCnv(req_to)
    posts = Post.query.filter(Post.date_post >= date_from).filter(Post.date_post <= date_to) \
        .order_by(Post.date_post.desc()) \
        .paginate(page, itemPerPage, error_out=False)
    post_paginated = posts.items
    total = posts.total
    num_page = total//itemPerPage + 1
    list = [str(x.author_id) for x in post_paginated]
    str_list = ','.join(set(list))
    with get_connection(post, name='profile') as conn:
        resp = conn.get(ServiceURL.PROFILE_SERVICE + 'list_user_profile?list=' + str_list)
        if resp.status_code != 200:
            raise CustomException('Cannot found post', 404)
    data = resp.json().get('profile')
    list_post = []
    data_index = [x.get('user_id') for x in data]
    for element in post_paginated:
        index = data_index.index(element.author_id)
        json = element.to_json_summary(data[index].get('name'), data[index].get('avatar_hash'))
        list_post.append(json)
    return jsonify({'Post': list_post,
                    'page': page,
                    'itemPerPage': itemPerPage,
                    'total_pages': num_page}), 200
