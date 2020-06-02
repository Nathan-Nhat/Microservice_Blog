from app.api import post
from app.helper.Exception import CustomException
from flask import jsonify, request
#
#
# @post.errorhandler(CustomException)
# def handle_error(ex):
#     return ex.to_json()
#
#
# @post.errorhandler(Exception)
# def handle_exception(ex):
#     return jsonify({'message': 'There are some errors. Try again'}), 500
@post.app_errorhandler(404)
def error_404(e):
    response = jsonify({'error': 'Cannot found result yet' + f'{request.path}'})
    response.headers['Content-Type'] = 'application/json'
    response.status_code = 404
    return response