from app import create_app, db
import os
cur = create_app(os.environ.get('FLASK_CONFIG', 'default'))
with cur.app_context():
    db.drop_all()
    db.create_all()
