import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_JWT_KEY = os.environ.get('SECRET_JWT_KEY')
    BLOG_ADMIN = os.environ.get('BLOG_ADMIN')
    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    DEBUG = True
    AUTH_SERVICE = 'http://localhost:5000/api/v1/auth/'
    PROFILE_SERVICE = 'http://localhost:5001/api/v1/profile/'
    POST_SERVICE = 'http://localhost:5002/api/v1/post/'
    FRONT_END_SERVER = 'http://localhost:3000'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or 'mysql+pymysql://root:Wakerjacob@90@localhost' \
                                                                    ':3306/post?charset=utf8mb4'


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL')


class ProductionConfig(Config):
    AUTH_SERVICE = 'http://auth_service:5000/api/v1/auth/'
    PROFILE_SERVICE = 'http://profile_service:5001/api/v1/profile/'
    POST_SERVICE = 'http://post_service:5002/api/v1/post/'
    FRONT_END_SERVER = 'http://35.240.191.124/'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'mysql+pymysql://root:Wakerjacob@90@mysql' \
                                                                    ':3306/post?charset=utf8mb4'


config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
