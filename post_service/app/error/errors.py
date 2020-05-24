from app.api import post
from app.helper.Exception import CustomException
from flask import jsonify
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
