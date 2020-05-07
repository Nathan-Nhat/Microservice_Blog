from flask import Blueprint
from app.helper.Connection import create_connection

profile = Blueprint('profile', __name__)
create_connection(profile, name='verify_jwt', timeout=10)

from app.api.api_profiles import *
from app.error.errors import *
