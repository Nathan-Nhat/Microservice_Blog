import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import Config
import json
from mail_service.Worker import Worker
from mail_service.Worker.ServiceURL import ServiceURL

class ResendConfirmWorker(Worker):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs, callback=resend_confirm_callback)


def resend_confirm_callback(ch, method, properties, body):
    data = json.loads(body)
    sender_email = Config.EMAIL_SENDER
    receiver_email = data.get('user_email')
    password = Config.EMAIL_PASSWORD

    message = MIMEMultipart("alternative")
    message["Subject"] = "Confirm user"
    message["From"] = 'SUPPORT BLOG TTN'
    message["To"] = receiver_email

    # Create the plain-text and HTML version of your message
    text = f"""\
        Hello {data.get('user_name')},
        This email to perform that you need to confirm your account. Please click in
        the address bellow to continue
        {ServiceURL.API_GATEWAY_SERVICE}/auth/confirm?token={data.get('token')}&user_id={data.get('user_id')}
    """
    html = f"""\
    <html>
      <body>
        <h2>Hello {data.get('user_name')},</h2>
        <p>This email to perform that you want to confirm your account. Please 
        click <a href = '{ServiceURL.API_GATEWAY_SERVICE}/auth/confirm?token={data.get('token')}&user_id={data.get('user_id')}'>
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
    server.sendmail(
        sender_email, receiver_email, message.as_string()
    )
