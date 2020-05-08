from . import post
from flask import jsonify
from app.helper.Exception import CustomException
from flask import request
from app.models.post_model import Post
from app import db
from datetime import datetime, timedelta
from app.helper.Convert import DateTimeCnv
from flask_cors import cross_origin
import time


@post.route('/test')
def test():
    raise CustomException('Test', 404)


@post.route('/', methods=['GET'])
def get_post_by_id():
    post_id = request.args.get('post_id')
    post = Post.query.filter_by(post_id=post_id).first()
    if post is None:
        raise CustomException('Cannot found post', 404)
    return jsonify(post.to_json()), 200


@post.route('/', methods=['POST'])
def add_post():
    post_details = request.get_json()
    if post_details.get('author_username') is None:
        raise CustomException('You need to put author', 500)
    post_add = Post(title=post_details.get('title'),
                    body=post_details.get('body'),
                    date_post=post_details.get('date_post') or datetime.utcnow(),
                    author_id=post_details.get('author_username'))
    db.session.add(post_add)
    db.session.commit()
    return jsonify(post_add.to_json()), 200


@post.route('/', methods=['DELETE'])
def delete_post():
    post_id = request.args.get('post_id')
    post_del = Post.query.filter_by(post_id=post_id).first()
    if post_del is None:
        raise CustomException('Cannot found post', 404)
    db.session.delete(post_del)
    db.session.commit()
    return jsonify(post_del.to_json()), 200


@post.route('/', methods=['PUT'])
def update_post():
    post_details = request.get_json()
    query = Post.query.filter_by(post_id=post_details['post_id'])
    post_update = query.first()
    if post_update is None:
        raise CustomException('Cannot found post', 404)
    query.update(post_details)
    db.session.commit()
    return jsonify(post_update.to_json()), 200


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
    num_post = Post.query.filter(Post.date_post <= date_to) \
        .order_by(Post.date_post.desc()).count()
    num_page = num_post // itemPerPage + 1
    return jsonify({'Post': list(map(lambda d: d.to_json_summary(), post_paginated)),
                    'page': page,
                    'itemPerPage': itemPerPage,
                    'total_pages': num_page}), 200
