from app import db
from flask_moment import datetime


class Post(db.Model):
    __tablename__ = 'posts'
    post_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text)
    body_summary = db.Column(db.Text)
    body = db.Column(db.Text)
    body_html = db.Column(db.Text)
    date_post = db.Column(db.DateTime, index=True, default=datetime.utcnow())
    author_id = db.Column(db.Integer)
    comments = db.relationship('Comments', backref='post', lazy='dynamic')

    def to_json_full(self, name, avatar_hash):
        ret = {
            'post_id': self.post_id,
            'title': self.title,
            'body_html': self.body_html,
            'date_post': self.date_post,
            'author_name': name,
            'author_avatar': avatar_hash,
            'author_id': self.author_id,
        }
        return ret

    def to_json_summary(self, name, avatar_hash):
        ret = {
            'post_id': self.post_id,
            'title': self.title,
            'body_summary': self.body_summary,
            'date_post': self.date_post,
            'author_name': name,
            'author_avatar': avatar_hash,
            'author_id': self.author_id
        }
        return ret
