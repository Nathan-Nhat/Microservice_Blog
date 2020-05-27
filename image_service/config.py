import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    CLOUDINARY_CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME')
    CLOUDINARY_API_KEY = os.environ.get('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = os.environ.get('CLOUDINARY_API_SECRET')
    pass


class DevelopmentConfig(Config):
    AUTH_SERVICE = 'http://localhost:5000/api/v1/auth/'
    PROFILE_SERVICE = 'http://localhost:5001/api/v1/profile/'
    POST_SERVICE = 'http://localhost:5002/api/v1/post/'
    FRONT_END_SERVER = 'http://localhost:3000'
    DEBUG = True


class TestingConfig(Config):
    TESTING = True


class ProductionConfig(Config):
    AUTH_SERVICE = 'http://auth_service:5000/api/v1/auth/'
    PROFILE_SERVICE = 'http://profile_service:5001/api/v1/profile/'
    POST_SERVICE = 'http://post_service:5002/api/v1/post/'
    FRONT_END_SERVER = 'http://35.240.191.124/'
    pass


config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
