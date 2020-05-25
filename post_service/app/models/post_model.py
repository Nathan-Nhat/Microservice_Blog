from app import db
from flask_moment import datetime
from app.models.tag_model import Tag_post


class Post(db.Model):
    __tablename__ = 'posts'
    post_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text)
    body = db.Column(db.Text)
    body_html = db.Column(db.Text)
    date_post = db.Column(db.DateTime, index=True, default=datetime.utcnow())
    author_id = db.Column(db.Integer)
    comments = db.relationship('Comments', backref='post', lazy='dynamic')
    like = db.relationship('Like', cascade="all, delete-orphan", backref="items", lazy='dynamic', )
    num_views = db.Column(db.Integer, default=0)
    tags = db.relationship('Tags',
                           secondary='tag_post',
                           cascade='save-update, merge',
                           backref=db.backref('posts', lazy='dynamic'),
                           lazy='dynamic')

    def to_json_little(self):
        return {
            'post_id': self.post_id,
            'title': self.title,
            'date_post': self.date_post,
            'num_comment': self.comments.count(),
            'num_like': self.like.count(),
            'num_views': self.num_views,
            'tags': list(map(lambda d : {'tag_name' : d.name, 'tag_id' : d.tag_id},self.tags.all()))
        }

    def to_json_full(self, author):
        author['num_posts'] = Post.query.filter_by(author_id=author.get('user_id')).count()
        ret = {
            'post_id': self.post_id,
            'title': self.title,
            'body_html': self.body_html,
            'date_post': self.date_post,
            'num_comment': self.comments.count(),
            'num_like': self.like.count(),
            'author': author,
            'num_views': self.num_views,
            'tags': list(map(lambda d : {'tag_name' : d.name, 'tag_id' : d.tag_id},self.tags.all()))
        }
        return ret

    def to_json_summary(self, author):
        ret = {
            'post_id': self.post_id,
            'title': self.title,
            'date_post': self.date_post,
            'num_comment': self.comments.count(),
            'num_like': self.like.count(),
            'author': author,
            'num_views': self.num_views,
            'tags': list(map(lambda d : {'tag_name' : d.name, 'tag_id' : d.tag_id},self.tags.all()))
        }
        return ret

    @staticmethod
    def order_by_reputaiton():
        return Post.num_views + Post.like.count() * 10
