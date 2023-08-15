up:
	cd ./srcs && docker compose up -d --build

down:
	cd ./srcs && docker compose down

start:
	cd ./srcs && docker compose start

stop:
	cd ./srcs && docker compose stop

.PHONY: down stop start up
