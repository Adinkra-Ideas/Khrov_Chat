up:
	cd ./srcs && docker compose up -d --build

down:
	cd ./srcs && docker compose down

start:
	cd ./srcs && docker compose start

stop:
	cd ./srcs && docker compose stop

ps:
	cd ./srcs && docker compose ps -a

kill:
	cd ./srcs && docker compose kill

clean:
	docker rm -f $(docker ps -a -q)
	docker volume rm $(docker volume ls -q)


	docker rm $$(docker ps -qa)
	docker rmi -f $$(docker images -qa)
	docker volume rm $$(docker volume ls -q)
	docker network rm $$(docker network ls -q) 2>/dev/null

fclean: clean
	docker system prune -a < yes

.PHONY: kill down stop start up ps clean fclean
