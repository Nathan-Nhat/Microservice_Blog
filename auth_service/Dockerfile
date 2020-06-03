FROM python:3.8.3-slim-buster
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 7000

CMD [ "python","-u", "./gunicorn_run.py" ]
