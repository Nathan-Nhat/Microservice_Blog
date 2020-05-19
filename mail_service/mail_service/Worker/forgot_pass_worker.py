import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import Config
import pika
import json


class ForgotPassWorker(object):
    def __init__(self, exchange, queue, routing_key):
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
        self.channel = self.connection.channel()
        self.channel.exchange_declare(exchange=exchange, exchange_type='topic')
        result = self.channel.queue_declare(queue, exclusive=False)
        self.queue_name = result.method.queue
        self.channel.queue_bind(queue=self.queue_name, exchange=exchange, routing_key=routing_key)
        self.channel.basic_qos(prefetch_count=1)
        self.tags = self.channel.basic_consume(queue=self.queue_name, on_message_callback=forgot_pass_callback,
                                               auto_ack=True)

    def start_consume(self, id):
        print(id)
        self.channel.start_consuming()

    def stop_consume(self):
        self.channel.basic_cancel(self.tags)
        pass


def forgot_pass_callback(ch, method, properties, body):
    data = json.loads(body)
    sender_email = Config.EMAIL_SENDER
    receiver_email = data.get('user_email')
    password = Config.EMAIL_PASSWORD

    message = MIMEMultipart("alternative")
    message["Subject"] = "Password reset"
    message["From"] = 'SUPPORT BLOG TTN'
    message["To"] = receiver_email

    # Create the plain-text and HTML version of your message
    text = f"""\
        Hello {data.get('user_name')},
        This email to perform that you want to reset your password. Please click in
        the address bellow to continue
        http://google.com
    """
    html = f"""\
    <html>
      <body>
        <h2>Hello {data.get('user_name')},</h2>
        <p>This email to perform that you want to reset your password. Please 
        click <a href = 'http://localhost:3000/change_password?token={data.get('token')}&user_id={data.get('user_id')}'>
            HERE</a> to continue </p>
      </body>
    </html>
    """

    # Turn these into plain/html MIMEText objects
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")

    # Add HTML/plain-text parts to MIMEMultipart message
    # The email client will try to render the last part first
    message.attach(part1)
    message.attach(part2)

    # Create secure connection with server and send email
    context = ssl.create_default_context()
    server = smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context)
    server.login(sender_email, password)
    senderrs = server.sendmail(
        sender_email, receiver_email, message.as_string()
    )
    print(senderrs)
