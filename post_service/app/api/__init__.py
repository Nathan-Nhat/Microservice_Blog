from flask import Blueprint

post = Blueprint('post', __name__)

from app.api.api_post import *
from app.error.errors import *
