from app.model.user_model import User
from app.auth import auth
from flask import jsonify
from app.model.user_model import confirm
from app.helper.Type import UserStatus
from app import db
from flask import request
from flask_cors import cross_origin

@auth.route('/confirm/<username>/<token>', methods=['GET'])
def confirm_user(username, token):
    user = User.query.filter_by(username=username).first()
    if user.confirmed:
        return jsonify({'message': 'User have been already confirmed',
                        'status': UserStatus.CONFIRM_ALREADY}), 200
    if user is None and not confirm(user, token):
        return jsonify({'message': 'There was an error when confirming user',
                        'status': UserStatus.CONFIRM_FAIL}), 200
    db.session.commit()
    return jsonify({'message': 'Confirm Successfully',
                    'status': UserStatus.CONFIRM_FAIL}), 200


@auth.route('/re_confirm')  # argument :email
def resend_confirm():
    email = request.args.get('email')
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({'message': 'User not found'}), 404
    if user.confirmed:
        return jsonify({'message': 'User is already confirmed'}), 404
    # send api for mail service
    return jsonify({'message': 'Sending email to confirm. Please check later'}), 200


@auth.route('/reset_password', methods = ['POST'])
@cross_origin(origins=['http://localhost:3000'])
def reset_password():
    body = request.get_json()
    email = body.get('email')
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({'message': 'User not found'}), 404
    #send mail
    return jsonify({'message': 'Sending email to reset password. Please check your email'}), 200