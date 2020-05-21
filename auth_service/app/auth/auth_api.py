from . import auth
from flask import request
from app.model.user_model import User
from flask import jsonify
from app import db
from app.helper.jwt_util import generate_jwt_token, decode_jwt_token
from flasgger.utils import swag_from
from flask_cors import cross_origin
from app.helper.Connection import get_connection
from app.helper.ServiceURL import ServiceURL
from app.helper.MailSender import MailSender
from app.model.user_model import confirm


@auth.route('/sign_up', methods=['POST'])
@swag_from('./openApi/sign_up.yml')
def sign_up_user():
    data = request.get_json()
    user_name = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if User.query.filter_by(username=user_name).first() is not None:
        resp = jsonify({'message': 'User is already exist'})
        resp.status_code = 403
        return resp

    if User.query.filter_by(email=email).first() is not None:
        resp = jsonify({'message': 'Email is already exist'})
        resp.status_code = 403
        return resp
    user = User(username=data.get('username'), email=data.get('email'), password=data.get('password'))
    try:
        # fake confirm first
        user.confirmed = 1
        db.session.add(user)
        db.session.commit()
        # add user profile
        with get_connection(auth, name='auth_service') as conn:
            user_details = {
                'profile_id': user.id,
                'email': user.email,
                'name': data.get('name'),
                'avatar_hash': 'https://www.w3schools.com/w3images/avatar2.png'
            }
            resp = conn.post(ServiceURL.PROFILE_SERVICE + 'user_profile', json=user_details)
        if resp.status_code != 200:
            print('Error when create user profile')
            raise Exception()
        # Send message to rabbitMQ to send email
        data = {
            'user_email': email,
            'user_id': user.id,
            'user_name': user.username
        }
        mail_sender = MailSender(exchange='mail_service', routing_key='confirm.resend', data=data)
        mail_sender.send()
        return jsonify({
            'username': user.username,
            'roles': user.roles.name
        }), 200
    except Exception:
        db.session.rollback()
        raise
        return jsonify({
            'message': 'There is some error',
        }), 500


@auth.route('/authenticate', methods=['POST'])
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
        resp = conn.get(ServiceURL.PROFILE_SERVICE + 'user_profile?profile_id=' + str(user.id))
        if resp.status_code != 200:
            return jsonify({'message': 'Cannot found profile'}), 403
    if not user.confirmed:
        return jsonify({'message': 'Your account is not confirmed'}), 403
    return jsonify({
        'jwt': jwt,
        'user_id': user.id,
        'user_username': user.username,
        'user_name': resp.json().get('name'),
        'user_email': resp.json().get('email')
    }), 200


@auth.route('/verify_login', methods=['GET'])
def verify_login():
    token = request.args.get('token')
    if token is None:
        return jsonify({
            'message': 'verify Fail'
        }), 403
    user_id_decode = decode_jwt_token(token)
    user = User.query.filter_by(id=user_id_decode).first()
    if user is None:
        return jsonify({
            'message': 'there is some thing wrong. Login again'
        }), 403
    with get_connection(auth, name='auth_service') as conn:
        resp = conn.get(ServiceURL.PROFILE_SERVICE + 'user_profile?profile_id=' + str(user_id_decode))
        if resp.status_code != 200:
            return jsonify({'message': 'Error here'}), 403
    return jsonify({
        'message': 'Valid User',
        'user_id': user_id_decode,
        'user_username': user.username,
        'user_name': resp.json().get('name'),
        'user_email': resp.json().get('email'),
        'user_avatar': resp.json().get('avatar_hash')
    }), 200


@auth.route('/reset_password', methods=['POST'])
def reset_password():
    email = request.get_json().get('email')
    if email is None:
        return jsonify({'message': 'Not found email'}), 404
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({'message': 'Not found user'}), 404
    data = {
        'user_email': email,
        'user_id': user.id,
        'user_name': user.username
    }
    mail_sender = MailSender(exchange='mail_service', routing_key='forgot_password.reset', data=data)
    mail_sender.send()
    return jsonify({'message': 'An email is sent to your mail. Please check'}), 200


@auth.route('/change_password', methods=['POST'])
def confirm_token_reset_pass():
    token = request.get_json().get('token')
    user_id = request.get_json().get('user_id')
    password = request.get_json().get('password')
    if token is None:
        return jsonify({'message': 'Invalid token'}), 403
    user = User.query.filter_by(id=user_id).first()
    if user is None or not confirm(user, token):
        return jsonify({'message': 'There was an error when confirming user'}), 403
    user.password = request.get_json().get('password')
    db.session.add(user)
    db.session.commit()
    return jsonify({
        'message': 'Change success'
    })
