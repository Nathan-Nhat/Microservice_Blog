FROM python:3.8.3-slim-buster
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 6000
EXPOSE 6001
EXPOSE 6002

CMD [ "python3", "./gunicorn_run.py" ]
