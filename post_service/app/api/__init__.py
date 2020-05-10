from flask import Blueprint
from app.helper.Connection import create_connection

post = Blueprint('post', __name__)
create_connection(post, name='verify_jwt', timeout=10)
create_connection(post, name='profile', timeout=10)
from app.api.api_post import *
from app.api.api_comment import *
from app.error.errors import *
