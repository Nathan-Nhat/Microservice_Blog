from app import db
from flask_moment import datetime


class Post(db.Model):
    __tablename__ = 'posts'
    post_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text)
    body_summary = db.Column(db.Text)
    body = db.Column(db.Text)
    date_post = db.Column(db.DateTime, index=True, default=datetime.utcnow())
    author_username = db.Column(db.String(32), unique=True)

    def to_json_full(self):
        ret = {
            'post_id': self.post_id,
            'title': self.title,
            'body': self.body,
            'date_post': self.date_post,
            'author_username': self.author_username,
        }
        return ret

    def to_json_summary(self):
        ret = {
            'post_id': self.post_id,
            'title': self.title,
            'body_summary': self.body_summary,
            'date_post': self.date_post,
            'author_username': self.author_username,
        }
        return ret
