from app import db
from flask_moment import datetime

class Follow(db.Model):
    __tablename__ = 'follow'
    follower_id = db.Column(db.Integer, db.ForeignKey('user_details.user_id'), primary_key=True)
    followed_id = db.Column(db.Integer, db.ForeignKey('user_details.user_id'), primary_key=True)
    date_follow = db.Column(db.DateTime, default=datetime.utcnow())

