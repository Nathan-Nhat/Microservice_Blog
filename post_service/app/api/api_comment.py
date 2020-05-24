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
from app.models.like_comment_model import LikeComment


@post.route('/comments', methods=['POST'])
# @cross_origin(origins=[ServiceURL.FRONT_END_SERVER, ServiceURL.FRONT_END_SERVER_DEV])
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
    ret = comment.to_json(resp.json(), 0)
    return jsonify(ret), 200


@post.route('/comments/<post_id>')
def get_comment(post_id):
    page = int(request.args.get('page', '1'))
    item_per_page = int(request.args.get('item_per_page', '20'))
    comments_paginate = Comments.query.filter_by(post_id=post_id).order_by(Comments.date_comment.desc()).paginate(page,
                                                                                                                  item_per_page,
                                                                                                                  error_out=False)
    comment = comments_paginate.items
    current_user_id = int(request.args.get('current_user_id', '0'))
    list_user_id = [str(d.user_id) for d in comment]
    str_list = ','.join(list_user_id)
    with get_connection(post, name='profile') as conn:
        resp = conn.get(ServiceURL.PROFILE_SERVICE + 'list_user_profile?list=' + str_list)
        if resp.status_code != 200:
            raise CustomException('Cannot found post', 404)
    if comment is None:
        return jsonify({'message': 'There is some thing wrong'}), 500
    data = resp.json().get('profile')
    list_comment = []
    data_index = [x.get('user_id') for x in data]
    for element in comment:
        index = data_index.index(element.user_id)
        json = element.to_json(data[index], current_user_id)
        list_comment.append(json)
    total = comments_paginate.total
    num_page = total // item_per_page + 1
    return jsonify({
        'comments': list_comment,
        'page': page,
        'item_per_page': item_per_page,
        'total': num_page
    }), 200


@post.route('/comments', methods=['PUT'])
@verify_jwt(blueprint=post, permissions=[Permission.COMMENT])
def edit_comment(user_id):
    data = request.get_json()
    comment_id = int(data.get('comment_id', '0'))
    user_comment_id = int(data.get('user_comment_id'))
    comment = Comments.query.filter_by(id=comment_id).first()
    if comment is None:
        raise CustomException('Cannot found comment', 404)
    if user_id != user_comment_id:
        raise CustomException('You dont have permission', 403)
    comment.body_html = data.get('body')
    html = markdown(data.get('body'))
    list_text = BeautifulSoup(html, features='html.parser').find_all(text=True)
    comment.body = '.'.join(list_text)
    db.session.add(comment)
    db.session.commit()
    return jsonify({'': ''}), 204


@post.route('/comments/<comment_id>', methods=['DELETE'])
@verify_jwt(blueprint=post, permissions=[Permission.COMMENT])
def delete_comment(user_id, comment_id):
    data = request.get_json()
    comment_id = int(comment_id)
    comment = Comments.query.filter_by(id=comment_id).first()
    if comment is None:
        raise CustomException('Cannot found comment', 404)
    if user_id != comment.user_id:
        raise CustomException('You dont have permisson', 403)
    db.session.delete(comment)
    db.session.commit()
    return jsonify({'': ''}), 204


@post.route('/comments/<comment_id>/like', methods=['POST'])
@verify_jwt(blueprint=post, permissions=[Permission.COMMENT])
def like_comment(user_id, comment_id):
    comment_id = int(comment_id)
    query_like = LikeComment.query.filter(LikeComment.comment_id == comment_id, LikeComment.user_id == user_id).first()
    if query_like is not None:
        raise CustomException(query_like.to_json(), 404)
    like_cmt = LikeComment(comment_id=comment_id, user_id=user_id)
    db.session.add(like_cmt)
    db.session.commit()
    return jsonify({'': ''}), 204


@post.route('/comments/<comment_id>/like', methods=['DELETE'])
@verify_jwt(blueprint=post, permissions=[Permission.COMMENT])
def unlike_comment(user_id, comment_id):
    comment_id = int(comment_id)
    like_cmt = LikeComment.query.filter(LikeComment.comment_id == comment_id, LikeComment.user_id == user_id).first()
    if like_cmt is None:
        raise CustomException('Cannot found comment', 404)
    db.session.delete(like_cmt)
    db.session.commit()
    return jsonify({'': ''}), 204
