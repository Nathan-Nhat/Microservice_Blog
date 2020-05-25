from app import db


class LikeComment(db.Model):
    __tablename__ = 'like_comment'
    comment_id = db.Column(db.Integer, db.ForeignKey('comments.id'), primary_key=True)
    user_id = db.Column(db.Integer, primary_key=True)

    def to_json(self):
        return {
            'comment_id' : self.comment_id,
            'user_id' : self.user_id
        }
