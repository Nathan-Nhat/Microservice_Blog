from config import config
import os


class ServiceURL:
    AUTH_SERVICE = config.get(os.getenv('FLASK_CONFIG') or 'default').AUTH_SERVICE
    PROFILE_SERVICE = config.get(os.getenv('FLASK_CONFIG') or 'default').PROFILE_SERVICE
    POST_SERVICE = config.get(os.getenv('FLASK_CONFIG') or 'default').POST_SERVICE
    FRONT_END_SERVER = config.get(os.getenv('FLASK_CONFIG') or 'default').FRONT_END_SERVER
