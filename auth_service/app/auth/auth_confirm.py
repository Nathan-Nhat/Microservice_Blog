from app.model.user_model import User
from app.auth import auth
from flask import jsonify
from app.model.user_model import confirm
from app.helper.Type import UserStatus
from app import db
from flask import request
from flask_cors import cross_origin
from app.helper.MailSender import MailSender
import json
from flask import redirect
from app.helper.ServiceURL import ServiceURL

@auth.route('/confirm', methods=['GET'])
def confirm_user():
    user_id = request.args.get('user_id')
    token = request.args.get('token')
    user = User.query.filter_by(id=user_id).first()
    if user.confirmed:
        return redirect(f'{ServiceURL.FRONT_END_SERVER_DEV}/login?type=0')
    if user is None or not confirm(user, token):
        message = 'There was an error when confirming user!'
        return redirect(f'{ServiceURL.FRONT_END_SERVER_DEV}/login?type=1')
    user.confirmed = True
    db.session.add(user)
    db.session.commit()
    return redirect(f'{ServiceURL.FRONT_END_SERVER_DEV}/login?type=0')


@auth.route('/re_confirm')  # argument :email
def resend_confirm():
    email = request.args.get('email')
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({'message': 'User not found'}), 404
    if user.confirmed:
        return jsonify({'message': 'User is already confirmed'}), 404
    # send api for mail service
    data = {
        'user_email': email,
        'user_id': user.id,
        'user_name': user.username
    }
    mail_sender = MailSender(exchange='mail_service', routing_key='confirm.resend', data=data)
    mail_sender.send()
    return jsonify({'message': 'Sending email to confirm. Please check later'}), 200
