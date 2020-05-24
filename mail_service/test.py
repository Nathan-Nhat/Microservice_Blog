import pika
import json

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.exchange_declare(exchange='mail_service', exchange_type='topic')

message = json.dumps({'user_email': 'trantrungnhat6196@gmail.com'})
channel.basic_publish(
    exchange='mail_service', routing_key='forgot_password.reset', body=message)
channel.basic_publish(
    exchange='mail_service', routing_key='forgot_password.reset', body=message)
channel.basic_publish(
    exchange='mail_service', routing_key='forgot_password.reset', body=message)
channel.basic_publish(
    exchange='mail_service', routing_key='forgot_password.reset', body=message)
print('Sending')
connection.close()