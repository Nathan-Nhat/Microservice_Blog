from . import profile
from flask import request
from app.models.userdetails_model import UserDetails
from app import db
from flask import jsonify
from app.helper.Resp_Json import resp_json
from app.helper.Exception import CustomException
from app.helper.auth_connector import verify_jwt, Permission
from flask_cors import cross_origin

@profile.route('/user_profile', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'])
def get_user_profile():
    user_id = request.args.get('user_id')
    user_details = UserDetails.query.filter_by(user_id=user_id).first()
    if user_details is None:
        raise CustomException('Cannot found User', status_code=404)
    return resp_json(user_details.to_json(), 200)


@profile.route('/user_profile', methods=['POST'])
def post_user_profile():
    user_details = request.get_json()
    if UserDetails.query.filter_by(email=user_details['email']).first() is not None:
        raise CustomException('User already exist', status_code=500)
    userDetails = UserDetails()
    userDetails.__dict__.update(user_details)
    db.session.add(userDetails)
    db.session.commit()
    return resp_json(userDetails.to_json(), 200)


@profile.route('/user_profile', methods=['PUT'])
@verify_jwt(blueprint=profile, permissions=[Permission.FOLLOW])
def put_user_profile():
    user_details = request.get_json()
    user_id = request.args.get('user_id')
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
