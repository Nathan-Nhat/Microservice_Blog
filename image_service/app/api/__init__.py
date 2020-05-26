from flask import Blueprint

image_service = Blueprint('image_service', __name__)

from app.api.image_api import *