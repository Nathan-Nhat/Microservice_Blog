build-fe-up:
	cd blog && yarn install && yarn run build
	sudo docker-compose up --build -d
build:
	sudo docker-compose up --build -d
up:
	sudo docker-compose up
down:
	sudo docker-compose down
restart:
	sudo docker-compose restart
stop:
	sudo docker-compose stop
up-logs:
	sudo docker-compose up
