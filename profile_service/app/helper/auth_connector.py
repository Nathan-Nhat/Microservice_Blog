from app.helper.Connection import get_connection
from functools import wraps
from app.helper.ServiceURL import ServiceURL
from flask import request, jsonify


class Permission:
    FOLLOW = 1  # 00001
    COMMENT = 2  # 00010
    WRITE = 4  # 00100
    MODERATE = 8  # 01000
    ADMIN = 16  # 10000


def verify_jwt(blueprint, permissions):
    def wrapper_first(func):
        @wraps(func)
        def inner_function(*args, **kwargs):
            user_id = int(request.args.get('user_id'))
            if user_id is None:
                return jsonify({'message': 'User dont have permission'}), 403
            with get_connection(blueprint, name='verify_jwt') as conn:
                token = request.args.get('token')
                if token is None:
                    return jsonify({'message': 'User dont have permission'}), 403
                param = {
                    'token': token,
                    'permissions': ','.join(str(x) for x in permissions)
                }
                resp = conn.get(ServiceURL.AUTH_SERVICE + 'verify_token', params=param)
                if resp.status_code != 200:
                    return jsonify({'message': 'User dont have permission'}), 403
                body = resp.json()
                if not body.get('allowed'):
                    return jsonify({'message': 'User dont have permission'}), 403
                if body.get('user_id') != user_id:
                    if not body.get('admin_permission'):
                        return jsonify({'message': 'User dont have permission'}), 403
                return func(*args, **kwargs)

        return inner_function

    return wrapper_first
