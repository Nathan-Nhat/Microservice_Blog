import pika
from app.model.user_model import generate_confirmation_token
import json


class MailSender(object):
    def __init__(self, user_id, user_email):
        self.user_email = user_email
        self.user_id = user_id
        self.token = generate_confirmation_token(user_id)
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
        self.channel = self.connection.channel()
        self.channel.exchange_declare(exchange='email_ex', exchange_type='direct')

    def send(self):
        message = {
            'token': self.token,
            'user_email': self.user_email
        }
        data = json.dumps(message)
        self.channel.basic_publish(exchange='email_ex', routing_key='email', body=data)
        self.connection.close()

    def __del__(self):
        if self.connection:
            self.connection.close()
