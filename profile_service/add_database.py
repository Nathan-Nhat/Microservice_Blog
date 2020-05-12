from app import create_app, db
cur = create_app('default')
with cur.app_context():
    db.drop_all()
    db.create_all()