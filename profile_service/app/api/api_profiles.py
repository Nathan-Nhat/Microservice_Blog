from . import profile
from flask import request
from app.models.userdetails_model import UserDetails
from app import db
from flask import jsonify
from app.helper.Resp_Json import resp_json
from app.helper.Exception import CustomException
from app.helper.auth_connector import verify_jwt, Permission
from flask_cors import cross_origin
from app.helper.Connection import get_connection
from app.helper.ServiceURL import ServiceURL


@profile.route('/user_profile', methods=['GET'])
@cross_origin(origins=['http://localhost:3000', 'http://localhost:5002', 'http://localhost:5000'])
def get_user_profile():
    user_id = request.args.get('profile_id')
    my_user_id = request.args.get('my_user_id')
    user_details = UserDetails.query.filter_by(user_id=user_id).first()
    if user_details is None:
        raise CustomException('Cannot found User', status_code=404)
    resp = user_details.to_json()
    if my_user_id is not None:
        my_user = UserDetails.query.filter_by(user_id=my_user_id).first()
        if my_user is not None:
            if my_user.is_following(user_id):
                resp['is_followed'] = True
            else:
                resp['is_followed'] = False
    with get_connection(profile, name='verify_jwt') as conn:
        resp_profile = conn.get(ServiceURL.POST_SERVICE + str(user_id) + '/total_posts')
        print(resp_profile.json())
        if resp_profile.status_code != 200:
            resp['total_posts'] = 0
        else:
            resp['total_posts'] = resp_profile.json().get('total_posts')
    return resp_json(resp, 200)


@profile.route('/user_profile', methods=['POST'])
def post_user_profile():
    user_details = request.get_json()
    user_id = user_details.get('profile_id')
    userDetails = UserDetails(user_id=user_id, email=user_details.get('email'), name=user_details.get('name'))
    userDetails.__dict__.update(user_details)
    db.session.add(userDetails)
    db.session.commit()
    return resp_json(userDetails.to_json(), 200)


@profile.route('/user_profile', methods=['PUT'])
@verify_jwt(blueprint=profile, permissions=[Permission.WRITE])
def put_user_profile(user_id):
    user_details = request.get_json()
    if user_details is None or user_id is None:
        raise CustomException('Invalid User', status_code=404)
    query = UserDetails.query.filter_by(user_id=user_id)
    userDetails = query.first()
    if userDetails is None:
        raise CustomException('Cannot found User', status_code=404)
    query.update(user_details)
    db.session.commit()
    return jsonify(userDetails.to_json()), 200


@profile.route('/user_profile', methods=['DELETE'])
def delete_user_details():
    user_id = request.args.get('user_id')
    if user_id is None:
        raise CustomException('Invalid request', status_code=404)
    userDetails = UserDetails.query.filter_by(user_id=user_id).first()
    if userDetails is None:
        raise CustomException('Cannot find User', 404)
    db.session.delete(userDetails)
    db.session.commit()
    return jsonify(userDetails.to_json()), 200


@profile.route('/ping', methods=['PUT'])
def ping():
    user_id = request.args.get('user_id')
    userDetails = UserDetails.query.filter_by(user_id=user_id).first()
    if userDetails is None:
        raise CustomException('Cannot find User', 404)
    userDetails.ping()
    db.session.commit()
    return jsonify(userDetails.to_json()), 200


@profile.route('/all_user', methods=['GET'])
def get_all_user():
    userDetails = UserDetails.query.all()
    count = UserDetails.query.count()
    return jsonify({'UserDetails': list(map(lambda d: d.to_json(), userDetails)), 'TotalUser': count})


@profile.route('/list_user_profile')
def get_list_user():
    str_list = request.args.get('list')
    arr_id = str_list.split(',')
    list_profile = UserDetails.query.filter(UserDetails.user_id.in_(arr_id)).all()
    if list_profile is None:
        raise CustomException('Error while fetch User Profile', 404)
    return jsonify({
        'profile': list(map(lambda d: d.to_json(), list_profile))}), 200


@profile.route('/follow', methods=['POST'])
@verify_jwt(blueprint=profile, permissions=[Permission.FOLLOW])
def add_follow(user_id):
    user_follow = request.args.get('user_follow')
    user = UserDetails.query.filter_by(user_id=user_id).first()
    if user is None or user_follow is None:
        raise CustomException('There some error', 500)
    user_follow = int(user_follow)
    user.follow(user_follow)
    db.session.commit()
    return jsonify({
        'message': 'Success'
    }), 200


@profile.route('/follow', methods=['DELETE'])
@verify_jwt(blueprint=profile, permissions=[Permission.FOLLOW])
def delete_follow(user_id):
    user_follow = request.args.get('user_follow')
    user = UserDetails.query.filter_by(user_id=user_id).first()
    if user is None or user_follow is None:
        raise CustomException('There some error', 500)
    user_follow = int(user_follow)
    user.un_follow(user_follow)
    db.session.commit()
    return jsonify({
        'message': 'Success'
    }), 200


@profile.route('/follow/<user_id>/followers', methods=['GET'])
def get_all_followers(user_id):
    user = UserDetails.query.filter_by(user_id=user_id).first()
    if user is None:
        raise CustomException('Cannot find user', 404)
    ret = list(map(lambda d: d.follower.to_short_json(), user.followers.all()))
    return jsonify(ret), 200


@profile.route('/follow/<user_id>/followeds', methods=['GET'])
def get_all_followeds(user_id):
    user = UserDetails.query.filter_by(user_id=user_id).first()
    if user is None:
        raise CustomException('Cannot find user', 404)
    ret = list(map(lambda d: d.followed.to_short_json(), user.followed.all()))
    return jsonify(ret), 200
