import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'trantrungnhat'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ITSDANGEROUS_SECRET_KEY = os.environ.get('ITSDANGEROUS_SECRET_KEY')
    ITSDANGEROUS_EXPIRATION = int(os.environ.get('ITSDANGEROUS_EXPIRATION', 3600))  # s
    SECRET_JWT_KEY = os.environ.get('SECRET_JWT_KEY')
    BLOG_ADMIN = os.environ.get('BLOG_ADMIN')
    SQLALCHEMY_POOL_SIZE = 1000
    RABBITMQ_URL = 'localhost'
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
                                                                    ':3306/authentication?charset=utf8mb4'


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL')


class ProductionConfig(Config):
    AUTH_SERVICE = 'http://auth_service:5000/api/v1/auth/'
    PROFILE_SERVICE = 'http://profile_service:5001/api/v1/profile/'
    POST_SERVICE = 'http://post_service:5002/api/v1/post/'
    FRONT_END_SERVER = 'http://tnshare.online'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'mysql+pymysql://root:Wakerjacob@90@mysql' \
                                                                    ':3306/authentication?charset=utf8mb4'


config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
