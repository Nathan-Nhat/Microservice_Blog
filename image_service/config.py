import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    pass


class DevelopmentConfig(Config):
    UPLOAD_DIR = '/home/ttnhat/upload'
    DEBUG = True


class TestingConfig(Config):
    TESTING = True


class ProductionConfig(Config):
    UPLOAD_DIR = '/usr/src/upload'
    pass


config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
