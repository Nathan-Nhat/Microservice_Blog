from . import auth
from flask import request
from app.model.user_model import User
from flask import jsonify
from app import db
from app.helper.jwt_util import generate_jwt_token, decode_jwt_token
from flasgger.utils import swag_from
from app.helper.validate import email_validation, password_validation
from flask_cors import cross_origin
from app.helper.Connection import get_connection
from app.helper.ServiceURL import ServiceURL


@auth.route('/sign_up', methods=['POST'])
@swag_from('./openApi/sign_up.yml')
def sign_up_user():
    data = request.get_json()
    user_name = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if not email_validation(email):
        return jsonify({'message': 'Email is Invalid'}), 404
    if not password_validation(password):
        return jsonify({'message': 'Password is Invalid'}), 404
    if User.query.filter_by(username=user_name).first() is not None:
        resp = jsonify({'message': 'User is already exist'})
        resp.status_code = 403
        return resp

    if User.query.filter_by(email=email).first() is not None:
        resp = jsonify({'message': 'Email is already exist'})
        resp.status_code = 403
        return resp
    user = User(username=data.get('username'), email=data.get('email'), password=data.get('password'))
    db.session.add(user)
    try:
        db.session.commit()
        # send_mail
        return jsonify({
            'username': user.username,
            'roles': user.roles.name
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': 'There is some error',
        }), 500


@auth.route('/authenticate', methods=['POST'])
@cross_origin(origins=['http://localhost:3000'])
def authenticate():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if user is None:
        return jsonify({'message': 'Invalid Username'}), 403
    if not user.verify_password(password):
        return jsonify({'message': 'Invalid Password'}), 403
    jwt = generate_jwt_token(user.id)
    with get_connection(auth, name='auth_service') as conn:
        resp = conn.get(ServiceURL.PROFILE_SERVICE + 'user_profile?user_id=' + str(user.id))
        if resp.status_code != 200:
            return jsonify({'message': 'Invalid Password'}), 403
    return jsonify({
        'jwt': jwt,
        'user_id': user.id,
        'user_username': user.username,
        'user_name': resp.json().get('name'),
        'user_email': resp.json().get('email')
    }), 200


@auth.route('/verify_login', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'])
def verify_login():
    token = request.args.get('token')
    user_id = request.args.get('user_id')
    if user_id is None or token is None:
        return jsonify({
            'message': 'verify Fail'
        }), 403
    user_id = int(user_id)
    user_id_decode = decode_jwt_token(token)
    if user_id != user_id_decode:
        return jsonify({
            'message': 'there is some thing wrong. Login again'
        }), 403
    user = User.query.filter_by(id=user_id).first()
    if user is None :
        return jsonify({
            'message': 'there is some thing wrong. Login again'
        }), 403
    with get_connection(auth, name='auth_service') as conn:
        resp = conn.get(ServiceURL.PROFILE_SERVICE + 'user_profile?user_id=' + str(user_id))
        if resp.status_code != 200:
            return jsonify({'message': 'Invalid Password'}), 403
    return jsonify({
        'message': 'Valid User',
        'user_id': user_id,
        'user_username': user.username,
        'user_name': resp.json().get('name'),
        'user_email': resp.json().get('email')
    }), 200
