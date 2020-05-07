from app import db
from flask_moment import datetime


class Post(db.Model):
    __tablename__ = 'posts'
    post_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text)
    body = db.Column(db.Text)
    date_post = db.Column(db.DateTime, index=True, default=datetime.utcnow())
    author_id = db.Column(db.Integer)

    def to_json(self):
        ret = {
            'post_id': self.post_id,
            'title': self.title,
            'body': self.body,
            'date_post': self.date_post,
            'author_id': self.author_id
        }
        return ret
