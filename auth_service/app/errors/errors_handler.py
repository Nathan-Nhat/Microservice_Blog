from app.auth import auth
from flask import jsonify
from jwt import ExpiredSignatureError, InvalidTokenError
from flask import request

@auth.app_errorhandler(404)
def error_404(e):
    response = jsonify({'error': 'Cannot found result yet' + f'{request.path}'})
    response.headers['Content-Type'] = 'application/json'
    response.status_code = 404
    return response


@auth.app_errorhandler(ExpiredSignatureError)
def error_jwt_expired(e):
    response = jsonify({'Error': 'Jwt Token had been expired'})
    response.headers['Content-Type'] = 'application/json'
    response.status_code = 403
    return response


@auth.app_errorhandler(InvalidTokenError)
def error_jwt_invalid(e):
    response = jsonify({'Error': 'Jwt Token is error'})
    response.headers['Content-Type'] = 'application/json'
    response.status_code = 403
    return response


# @auth.app_errorhandler(Exception)
# def error_not_found(e):
#     response = jsonify({'Error': 'There was some error. Please try again'})
#     response.headers['Content-Type'] = 'application/json'
#     response.status_code = 500
#     return response
