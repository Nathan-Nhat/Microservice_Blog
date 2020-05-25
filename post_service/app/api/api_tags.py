from . import post
from app.models.tag_model import Tags, Tag_user
from flask import request
from flask import jsonify
from app.helper.auth_connector import verify_jwt
from app.helper.auth_connector import Permission
from app.helper.Exception import CustomException
from app import db
from app.helper.Connection import get_connection
from app.helper.auth_connector import ServiceURL
from app.models.post_model import Post
from sqlalchemy import desc, func, text
from app.models.tag_model import Tag_post


@post.route('/tags')
def get_tag():
    query_tag = request.args.get('query_tag', '')
    page = int(request.args.get('page', 0))
    current_user_id = int(request.args.get('current_user_id', '0'))
    result = db.session.query(Tags, func.count(Tag_post.post_id).label('total_post')).join(Tag_post) \
        .filter(Tags.name.like(f'%{query_tag}%')) \
        .group_by(Tags.tag_id) \
        .order_by(text('total_post desc')) \
        .paginate(page=page, per_page=30, error_out=False)
    tag_list = result.items
    return jsonify({
        'page': page,
        'total_tags': result.total,
        'total_pages': result.total // 30 + 1,
        'tags': list(map(lambda d: d[0].to_json(current_user_id), tag_list))})


@post.route('/tags/<tag_id>/follow', methods=['POST'])
@verify_jwt(blueprint=post, permissions=[Permission.WRITE])
def follow_tag(user_id, tag_id):
    print(tag_id, user_id)
    tags = Tags.query.filter_by(tag_id=tag_id).first()
    if tags is None:
        raise CustomException('Cannot found tags', 404)
    tags_user = Tag_user.query.filter(Tag_user.tag_id == tag_id, Tag_user.user_id == user_id).first()
    if tags_user is not None:
        print(tags_user)
        raise CustomException('User followed tags', 500)
    try:
        tag_user = Tag_user(user_id=user_id, tag_id=tag_id)
        db.session.add(tag_user)
        db.session.commit()
        return jsonify({'message': 'Success'}), 200
    except:
        db.session.rollback()
        return jsonify({'error': 'Error'}), 500


@post.route('/tags/<tag_id>/follow', methods=['DELETE'])
@verify_jwt(blueprint=post, permissions=[Permission.WRITE])
def unfollow_tag(user_id, tag_id):
    tag_user = Tag_user.query.filter(Tag_user.tag_id == tag_id, Tag_user.user_id == user_id).first()
    if tag_user is None:
        raise CustomException('Cannot find user_tag', 404)
    try:
        db.session.delete(tag_user)
        db.session.commit()
        return jsonify({'message': 'Success'}), 200
    except:
        db.session.rollback()
        return jsonify({'error': 'Error'}), 500


@post.route('/tags/<tag_id>/post')
def get_post_by_tag(tag_id):
    page = int(request.args.get('page', '0'))
    current_user_id = int(request.args.get('current_user_id', '0'))
    itemPerPage = 20
    tags = Tags.query.filter(Tags.tag_id == tag_id).first()
    num_user = tags.tag_user.count()
    posts = tags.posts \
        .order_by(Post.date_post.desc()) \
        .paginate(page, itemPerPage, error_out=False)
    post_paginated = posts.items
    total = posts.total
    num_page = total // itemPerPage + 1
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
        json = element.to_json_summary(data[index])
        json['is_liked'] = False
        if current_user_id is not None:
            like = element.like.filter_by(user_id=current_user_id).first()
            if like is not None:
                json['is_liked'] = True
        list_post.append(json)
    is_followed = False
    if current_user_id is not None:
        print(current_user_id)
        tag_user = Tag_user.query.filter(Tag_user.tag_id == tag_id, Tag_user.user_id == current_user_id).first()
        print(tag_user)
        if tag_user is not None:
            is_followed = True
    return jsonify({
        'tag_id': tags.tag_id,
        'tag_name': tags.name,
        'url_image': tags.url_image,
        'Post': list_post,
        'is_followed': is_followed,
        'page': page,
        'itemPerPage': itemPerPage,
        'total_pages': num_page,
        'total': total,
        'num_follower': num_user}), 200
