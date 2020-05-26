import os
import app


class ServiceURL:
    AUTH_SERVICE = app.config['AUTH_SERVICE']
    PROFILE_SERVICE = app.config['PROFILE_SERVICE']
    POST_SERVICE = app.config['POST_SERVICE']
    FRONT_END_SERVER = app.config['FRONT_END_SERVER']
