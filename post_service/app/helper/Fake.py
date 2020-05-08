from faker import Faker
from app.models.post_model import Post
from app import db
import random
from app.helper.Convert import ConvertToDate
import requests


def fake(count=10000):
    faker = Faker()
    for i in range(count):
        post = Post(title=faker.text(),
                    body=faker.text(),
                    date_post=ConvertToDate(faker.past_date()),
                    author_id=random.randint(1, 999))
        res = requests.get(f'http://localhost:5001/api/v1/profile/user_profile?user_id={post.author_id}')
        if res.status_code == 200:
            post.author_name = res.json().get('name')
        else:
            post.author_name = 'N/A'
        db.session.add(post)
    db.session.commit()
