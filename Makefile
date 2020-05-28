build-fe-git:
	git pull
	cd blog && yarn install && yarn run build
	docker-compose up --build -d
build-fe-up:
	cd blog && yarn install && yarn run build
	docker-compose up --build -d
build-pull:
	git pull
	docker-compose up --build -d
build:
	docker-compose up --build -d
up:
	docker-compose up
down:
	docker-compose down
restart:
	docker-compose restart
stop:
	docker-compose stop
up-logs:
	docker-compose up
