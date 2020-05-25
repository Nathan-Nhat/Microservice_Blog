from app import db
from flask_moment import datetime
from app.models.follow_model import Follow
import hashlib

class UserDetails(db.Model):
    __tablename__ = 'user_details'
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=False)
    name = db.Column(db.String(64))
    email = db.Column(db.String(64), unique=True)
    address = db.Column(db.String(128))
    about_me = db.Column(db.Text())
    member_since = db.Column(db.DateTime(), default=datetime.utcnow())
    last_seen = db.Column(db.DateTime(), default=datetime.utcnow())
    avatar_hash = db.Column(db.Text)
    followed = db.relationship('Follow',
                               foreign_keys=[Follow.follower_id],
                               backref=db.backref('follower', lazy='joined'),
                               lazy='dynamic',
                               cascade='all, delete-orphan')
    followers = db.relationship('Follow',
                                foreign_keys=[Follow.followed_id],
                                backref=db.backref('followed', lazy='joined'),
                                lazy='dynamic',
                                cascade='all, delete-orphan')

    def __init__(self, **kwargs):
        super(UserDetails, self).__init__(**kwargs)

    def to_json(self):
        json_user_details = {
            'user_id': self.user_id,
            'name': self.name,
            'email': self.email,
            'address': self.address,
            'about_me': self.about_me,
            'member_since': self.member_since,
            'last_seen': self.last_seen,
            'avatar_hash': self.avatar_hash,
            'number_follower': self.followers.count(),
            'number_followed': self.followed.count()
        }
        return json_user_details

    def to_short_json(self):
        short_json = {
            'user_id': self.user_id,
            'user_name': self.name,
            'user_avatar': self.avatar_hash,
            'number_follower': self.followers.count(),
            'number_followed': self.followed.count()
        }
        return short_json

    def ping(self):
        self.last_seen = datetime.utcnow()

    def is_following(self, user_id):
        followed = self.followed.filter_by(followed_id=user_id).first()
        if followed is not None:
            return True
        return False

    def follow(self, user_id):
        if not self.is_following(user_id):
            f = Follow(follower_id=self.user_id, followed_id=user_id, date_follow=datetime.utcnow())
            db.session.add(f)

    def un_follow(self, user_id):
        if self.is_following(user_id):
            f = Follow.query.filter_by(followed_id=user_id).first()
            if f is not None:
                db.session.delete(f)

    def gravatar(self, size=100, default='identicon', rating='g'):
        url = 'https://secure.gravatar.com/avatar'
        hash = hashlib.md5(self.email.lower().encode('utf-8')).hexdigest()
        return '{url}/{hash}?s={size}&d={default}&r={rating}'.format(
            url=url, hash=hash, size=size, default=default, rating=rating)