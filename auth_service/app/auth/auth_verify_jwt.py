from flask import jsonify
from . import auth
from flask import request
from app.helper.jwt_util import decode_jwt_token
from app.model.user_model import User
from app.model.role_model import Permission


@auth.route('/verify_token')
def verify_jwt():
    token = request.args.get('token')
    permissions = request.args.get('permissions')
    list_perm = permissions.split(',')
    print(list_perm)
    if token is None:
        return jsonify({
            'user_id': None,
            'allowed': False}), 403
    user_id = decode_jwt_token(token)
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return jsonify({
            'user_id': None,
            'allowed': False}), 403
    for perm in list_perm:
        int_perm = int(perm)
        if not user.can(int_perm):
            return jsonify({'user_id': user.username, 'allowed': False}), 403
    return jsonify({
        'user_id': user.id,
        'allowed': True,
        'admin_permission': user.can(Permission.ADMIN)
    })


@auth.route('/test')
def test():
    return jsonify({'message': 'Success'})
