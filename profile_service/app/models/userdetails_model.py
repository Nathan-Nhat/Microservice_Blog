from app import db
from flask_moment import datetime


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
            'avatar_hash': self.avatar_hash
        }
        return json_user_details

    def ping(self):
        self.last_seen = datetime.utcnow()
