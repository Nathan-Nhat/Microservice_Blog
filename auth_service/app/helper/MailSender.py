import pika
from app.model.user_model import generate_confirmation_token
import json


class MailSender(object):
    def __init__(self, exchange, routing_key, data):
        self.user_email = data.get('user_email')
        self.user_id = data.get('user_id')
        self.user_name = data.get('user_name')
        self.token = generate_confirmation_token(self.user_id)
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
        self.channel = self.connection.channel()
        self.exchange = exchange
        self.routing_key = routing_key
        self.channel.exchange_declare(exchange=self.exchange, exchange_type='topic')

    def send(self):
        message = {
            'token': self.token,
            'user_email': self.user_email,
            'user_name': self.user_name,
            'user_id': self.user_id
        }
        data = json.dumps(message)
        self.channel.basic_publish(exchange=self.exchange, routing_key=self.routing_key, body=data)
        self.connection.close()

    def __del__(self):
        if self.connection:
            self.connection.close()
