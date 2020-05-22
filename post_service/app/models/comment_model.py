from app import db
from flask_moment import datetime


class Comments(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text)
    body_html = db.Column(db.Text)
    date_comment = db.Column(db.DateTime, index=True, default=datetime.utcnow())
    disable = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.post_id'))
    user_like = db.relationship('LikeComment', backref='comment', lazy='dynamic')

    def to_json(self, user_comment, user_id):
        return {
            'comment_id' : self.id,
            'body_html': self.body_html,
            'date_comment': self.date_comment,
            'disable': self.disable,
            'post_id': self.post_id,
            'user_comment': user_comment,
            'number_like': self.user_like.count(),
            'is_liked': self.is_liked_comment(user_id)
        }

    def is_liked_comment(self, user_id):
        like_cmt = self.user_like.filter_by(user_id=user_id).first()
        if like_cmt is None:
            return False
        return True
