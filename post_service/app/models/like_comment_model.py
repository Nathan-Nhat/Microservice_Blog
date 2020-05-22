from app import db


class LikeComment(db.Model):
    __tablename__ = 'like_comment'
    id = db.Column(db.Integer, primary_key=True)
    comment_id = db.Column(db.Integer, db.ForeignKey('comments.id'))
    user_id = db.Column(db.Integer)
