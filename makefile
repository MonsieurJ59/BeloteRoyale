# 🐳 Commandes Docker
start:
	docker-compose up -d --build

stop:
	docker-compose down

restart:
	docker-compose down && docker-compose up -d --build
