from app import db


class Tag_post(db.Model):
    __tablename__ = 'tag_post'
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.tag_id'), primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.post_id'), primary_key=True)


class Tag_user(db.Model):
    __tablename__ = 'tag_user'
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.tag_id'), primary_key=True)
    user_id = db.Column(db.Integer, primary_key=True)


class Tags(db.Model):
    __tablename__ = 'tags'
    tag_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), unique=True)
    tag_user = db.relationship('Tag_user',
                               backref='tag_user',
                               lazy='dynamic')
    url_image = db.Column(db.String(100),
                          default='https://www.sketchappsources.com/resources/source-image/python-logo.png')

    posts = db.relationship('Post',
                            secondary='tag_post',
                            backref=db.backref('tags', lazy='dynamic', cascade='save-update, merge'),
                            lazy='dynamic')

    def is_following_tag(self, user_id):
        if self.tag_user.filter_by(user_id=user_id).first():
            return True
        return False

    def to_json(self, user_id):
        ret = {
            'tag_id': self.tag_id,
            'tag_name': self.name,
            'num_posts': self.posts.count(),
            'tag_image': self.url_image,
            'num_following': self.tag_user.count(),
            'is_followed': self.is_following_tag(user_id=user_id)
        }
        return ret
