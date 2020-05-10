from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import config
from flasgger import Swagger
from flask_moment import Moment
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
swagger = Swagger()
moment = Moment()
cors = CORS()

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)
    db.init_app(app)
    cors.init_app(app)
    migrate.init_app(app, db)
    swagger.init_app(app)
    moment.init_app(app)
    from app.api import post
    from app.models.post_model import Post
    from app.models.comment_model import Comments
    app.register_blueprint(post, url_prefix='/api/v1/post')
    return app
