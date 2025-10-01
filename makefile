# 🐳 Commandes Docker
.PHONY: start stop restart logs clean rebuild db-reset

# Démarrer tous les services (sans rebuild)
start:
	docker-compose up -d

# Démarrer avec rebuild (seulement quand nécessaire)
rebuild:
	docker-compose up -d --build

# Démarrage rapide (sans détacher)
dev:
	docker-compose up

# Arrêter tous les services
stop:
	docker-compose down

# Redémarrer les services
restart:
	docker-compose restart

# Nettoyer et redémarrer complètement
clean-start:
	docker-compose down -v
	docker-compose up -d --build

# Voir les logs
logs:
	docker-compose logs -f

# Voir les logs d'un service spécifique
logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-mysql:
	docker-compose logs -f mysql

# Exécuter les fixtures
fixtures:
	docker-compose exec backend npm run seed

# Entrer dans le conteneur backend
shell-backend:
	docker-compose exec backend sh

# Entrer dans le conteneur frontend
shell-frontend:
	docker-compose exec frontend sh

# Voir le statut des conteneurs
status:
	docker-compose ps

# Nettoyer les images et volumes inutilisés
clean:
	docker system prune -f
	docker volume prune -f