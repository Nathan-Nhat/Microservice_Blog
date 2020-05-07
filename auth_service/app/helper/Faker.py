from faker import Faker
from app.model.user_model import User
from app import db
import requests


def fake_user(count=1000):
    faker = Faker()
    for i in range(1, count):
        user = User(username=f'{faker.user_name()}{i}',
                    password='Wakerjacob@90',
                    email=f'{i}{faker.email()}',
                    confirmed=True)
        if i == 0:
            user.role_id = 3
        elif i in [1, 2, 3]:
            user.role_id = 2
        else:
            user.role_id = 1
        user_details = {
            'user_id': i,
            'name': faker.name(),
            'email': user.email,
            'address': faker.address(),
            'about_me': faker.text()
        }
        requests.post('http://127.0.0.1:5001/api/v1/profile/user_profile', json=user_details)
        db.session.add(user)
    db.session.commit()
