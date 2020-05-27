from flask import Blueprint
from app.helper.Connection import create_connection

image_service = Blueprint('image_service', __name__)
create_connection(image_service, name='verify_jwt', timeout=10)
from app.api.image_api import *
