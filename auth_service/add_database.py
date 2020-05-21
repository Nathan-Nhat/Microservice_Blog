from app import create_app, db
from app.model.role_model import Roles
import os
cur = create_app(os.environ.get('FLASK_CONFIG', 'default'))
with cur.app_context():
    db.drop_all()
    db.create_all()
    Roles.insert_role()

