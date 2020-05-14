from . import post
from app.models.comment_model import Comments
from flask import request
from markdown import markdown
from bs4 import BeautifulSoup
from app import db
from app.helper.ServiceURL import ServiceURL
from app.helper.Connection import get_connection
from flask import jsonify
from flask_cors import cross_origin
from app.helper.Exception import CustomException
from flask_moment import datetime
from app.helper.auth_connector import verify_jwt
from app.helper.auth_connector import Permission

@post.route('/comments', methods=['POST'])
@cross_origin(origins=['http://localhost:3000'])
@verify_jwt(blueprint=post, permissions=[Permission.COMMENT])
def add_comment(user_id):
    data = request.get_json()
    body = data.get('body')
    html = markdown(body)
    list_text = BeautifulSoup(html, features='html.parser').find_all(text=True)
    body_text = '.'.join(list_text)
    comment = Comments(
        body=body_text,
        body_html=body,
        post_id=data.get('post_id'),
        date_comment=datetime.utcnow(),
        user_id=user_id
    )
    with get_connection(post, name='profile') as conn:
        resp = conn.get(ServiceURL.PROFILE_SERVICE + 'user_profile?profile_id=' + str(comment.user_id))
        if resp.status_code != 200:
            raise CustomException('Cannot found post', 404)
    db.session.add(comment)
    db.session.commit()
    ret = comment.to_json(resp.json())
    return jsonify(ret), 200


@post.route('/comments/<post_id>')
@cross_origin(origins=['http://localhost:3000'])
def get_comment(post_id):
    page = int(request.args.get('page', '0'))
    item_per_page = int(request.args.get('item_per_page', '20'))
    comments_paginate = Comments.query.filter_by(post_id=post_id).order_by(Comments.date_comment.desc()).paginate(page,
                                                                                                                  item_per_page,
                                                                                                                  error_out=False)
    comment = comments_paginate.items
    list_user_id = [str(d.user_id) for d in comment]
    str_list = ','.join(list_user_id)
    with get_connection(post, name='profile') as conn:
        resp = conn.get(ServiceURL.PROFILE_SERVICE + 'list_user_profile?list=' + str_list)
        if resp.status_code != 200:
            raise CustomException('Cannot found post', 404)
    if comment is None:
        return jsonify({'message': 'There is some thing wrong'}), 500
    data = resp.json().get('profile')
    print(data)
    list_comment = []
    data_index = [x.get('user_id') for x in data]
    for element in comment:
        index = data_index.index(element.user_id)
        json = element.to_json(data[index])
        list_comment.append(json)
    total = comments_paginate.total
    num_page = total // item_per_page + 1
    return jsonify({
        'comments': list_comment,
        'page': page,
        'item_per_page': item_per_page,
        'total': num_page
    }), 200
