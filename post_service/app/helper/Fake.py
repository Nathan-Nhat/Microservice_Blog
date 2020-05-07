from faker import Faker
from app.models.post_model import Post
from app import db
import random
from app.helper.Convert import ConvertToDate

def fake(count=100000):
    faker = Faker()
    for i in range(count):
        post = Post(title=faker.text(),
                    body=faker.text(),
                    date_post=ConvertToDate(faker.past_date()),
                    author_id=random.randint(1, 9999))
        db.session.add(post)
    db.session.commit()
