import jwt
from datetime import datetime, timedelta
from flask import current_app
from functools import wraps
from flask import jsonify
from flask import request
from app.model.user_model import User


def generate_jwt_token(user_id):
    payload = {
        'exp': datetime.utcnow() + timedelta(days=1),
        'iat': datetime.utcnow(),
        'sub': user_id
    }
    jwt_token = jwt.encode(
        payload=payload,
        key=current_app.config['SECRET_JWT_KEY'],
        algorithm='HS256'
    )
    return jwt_token.decode(encoding='utf-8')


def decode_jwt_token(token):
    payload = jwt.decode(token, key=current_app.config['SECRET_JWT_KEY'])
    return payload['sub']

