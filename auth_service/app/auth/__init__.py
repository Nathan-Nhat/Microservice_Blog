from flask import Blueprint
from app.helper.Connection import create_connection
auth = Blueprint('auth', __name__)
create_connection(auth, name='auth_service', timeout=10)
from .auth_api import *
from .auth_confirm import *
from ..errors.errors_handler import *
from .auth_verify_jwt import *