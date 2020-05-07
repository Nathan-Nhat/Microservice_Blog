from app import create_app
from app.helper.Fake import fake

cur_app = create_app('development')
with cur_app.app_context():
    fake()