from flask import jsonify


class CustomException(Exception):
    def __init__(self, message, status_code):
        self.message = message
        self.status_code = status_code

    def to_json(self):
        return jsonify(self.__dict__), self.status_code
