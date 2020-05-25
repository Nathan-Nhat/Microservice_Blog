import json
from .ConvertDateJson import default
from flask import make_response


def resp_json(body={}, status=200):
    if body.get('_sa_instance_state') is not None:
        del body['_sa_instance_state']
    body = json.dumps(body, default=default)
    response = make_response(body)
    response.status_code = 200
    response.headers['Content-type'] = 'application/json'
    return response
