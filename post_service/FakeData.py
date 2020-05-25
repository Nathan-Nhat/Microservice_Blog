from app import create_app
from app.helper.Fake import fake

with create_app('default').app_context():
    fake()