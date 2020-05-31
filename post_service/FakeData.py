from app import create_app
from app.helper.Fake import fake

with create_app('production').app_context():
    fake()