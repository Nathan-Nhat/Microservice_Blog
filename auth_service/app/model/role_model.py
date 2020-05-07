from app import db


class Permission:
    FOLLOW = 1  # 00001
    COMMENT = 2  # 00010
    WRITE = 4  # 00100
    MODERATE = 8  # 01000
    ADMIN = 16  # 10000


class Roles(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)
    default = db.Column(db.Boolean, default=False, index=True)
    permission = db.Column(db.Integer)
    users = db.relationship('User', backref='roles', lazy='dynamic')

    def __init__(self, **kwargs):
        super(Roles, self).__init__(**kwargs)
        if self.permission is None:
            self.permission = 0

    def has_permission(self, permission):
        return self.permission & permission == permission

    def add_permission(self, permission):
        if not self.has_permission(permission):
            self.permission += permission

    def remove_permission(self, permission):
        if self.has_permission(permission):
            self.permission -= permission

    def reset_permission(self):
        if not self.permission:
            self.permission = 0

    @staticmethod
    def insert_role():
        roles = {
            'User': [Permission.FOLLOW, Permission.COMMENT, Permission.WRITE],
            'Moderator': [Permission.FOLLOW, Permission.COMMENT,
                          Permission.WRITE, Permission.MODERATE],
            'Administrator': [Permission.FOLLOW, Permission.COMMENT,
                              Permission.WRITE, Permission.MODERATE,
                              Permission.ADMIN],
        }
        default_role = 'User'
        for r in roles:
            print(r)
            role = Roles.query.filter_by(name=r).first()
            if role is None:
                role = Roles(name=r)
            role.reset_permission()
            for perm in roles[r]:
                role.add_permission(perm)
            role.default = (default_role == role.name)
            db.session.add(role)
        db.session.commit()

