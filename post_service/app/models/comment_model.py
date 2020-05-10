from app import db
from flask_moment import datetime


class Comments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text)
    body_html = db.Column(db.Text)
    date_comment = db.Column(db.DateTime, index=True, default=datetime.utcnow())
    disable = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.post_id'))

    def to_json(self, name, avatar_hash):
        return {
            'body_html': self.body_html,
            'date_comment': self.date_comment,
            'disable': self.disable,
            'user_id': self.user_id,
            'post_id': self.post_id,
            'user_name': name,
            'user_avatar': avatar_hash
        }
