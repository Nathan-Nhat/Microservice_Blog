from app.models.post_model import Post
from app import db
import requests
from flask_moment import datetime
from markdown import markdown
from app.models.tag_model import Tags, Tag_post

def fake():
    resp = requests.get('https://viblo.asia/api/posts/editors-choice?limit=500')
    json = resp.json()
    data = json.get('data')
    list_post = []
    for d in data:
        new_post = Post(title=d.get('title'), body=d.get('contents'), body_html=markdown(d.get('contents')),
            date_post=datetime.utcnow(), author_id=1)
        for tag in d.get('tags').get('data'):
            tag_target = Tags.query.filter_by(name=tag.get('name')).first()
            if tag_target is None:
                tag_insert = Tags(name=tag.get('name'), url_image=tag.get('image'))
                db.session.add(tag_insert)
                db.session.flush()
                new_post.tags.append(tag_insert)
            else:
                new_post.tags.append(tag_target)
        list_post.append(new_post)
    print(len(list_post))
    db.session.add_all(list_post)
    db.session.commit()
