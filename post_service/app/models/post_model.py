from app import db
from flask_moment import datetime


class Post(db.Model):
    __tablename__ = 'posts'
    post_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text)
    body = db.Column(db.Text)
    body_html = db.Column(db.Text)
    date_post = db.Column(db.DateTime, index=True, default=datetime.utcnow())
    author_id = db.Column(db.Integer)
    comments = db.relationship('Comments', backref='post', lazy='dynamic')
    like = db.relationship('Like', backref='post', lazy='dynamic')

    def to_json_full(self, author):
        author['num_posts'] = Post.query.filter_by(author_id=author.get('user_id')).count()
        ret = {
            'post_id': self.post_id,
            'title': self.title,
            'body_html': self.body_html,
            'date_post': self.date_post,
            'num_comment': self.comments.count(),
            'num_like': self.like.count(),
            'author' : author
        }
        return ret

    def to_json_summary(self, author):
        ret = {
            'post_id': self.post_id,
            'title': self.title,
            'date_post': self.date_post,
            'num_comment': self.comments.count(),
            'num_like': self.like.count(),
            'author': author
        }
        return ret
