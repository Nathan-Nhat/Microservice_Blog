from werkzeug.security import generate_password_hash, check_password_hash
from flask_moment import datetime
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from flask import current_app
from app.model.role_model import Roles
from app import db


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    password_hash = db.Column(db.String(128))
    email = db.Column(db.String(64), unique=True)
    confirmed = db.Column(db.Boolean, default=False)

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        if self.roles is None:
            if self.email == current_app.config['BLOG_ADMIN']:
                self.roles = Roles.query.filter_by(name='Administrator').first()
            else:
                self.roles = Roles.query.filter_by(default=True).first()

    @property
    def password(self):
        raise AttributeError('password is not readable')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def can(self, permission):
        return self.roles is not None and self.roles.has_permission(permission)


def generate_confirmation_token(user: User, expiration=3600):
    s = Serializer(current_app.config['ITSDANGEROUS_SECRET_KEY'], current_app.config['ITSDANGEROUS_EXPIRATION'])
    return s.dumps({'confirm': user.id}).decode('utf-8')


def confirm(user: User, token):
    s = Serializer(current_app.config['ITSDANGEROUS_SECRET_KEY'])
    try:
        data = s.loads(token.encode('utf-8'))
    except:
        return False
    print(data)
    if data.get('confirm') != user.id:
        return False
    user.confirmed = True
    print(user.confirmed)
    db.session.add(user)
    return True
