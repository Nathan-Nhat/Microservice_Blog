from app import create_app
from app.helper.Faker import fake_user

cur_app = create_app('development')

with cur_app.app_context():
    fake_user()
