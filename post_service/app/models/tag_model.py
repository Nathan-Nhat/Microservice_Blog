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
    url_image = db.Column(db.String(100), default='https://www.sketchappsources.com/resources/source-image/python-logo.png')

