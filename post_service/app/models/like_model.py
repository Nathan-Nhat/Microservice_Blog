from app import db
from flask_moment import datetime

class Like(db.Model):
    __tablename__ = 'like'
    post_id = db.Column(db.Integer, db.ForeignKey('posts.post_id'), primary_key=True)
    user_id = db.Column(db.Integer, primary_key=True)
    date_like = db.Column(db.DateTime, default=datetime.utcnow())