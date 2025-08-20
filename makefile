# 🐳 Commandes Docker
.PHONY: start stop restart logs clean rebuild db-reset

# Démarrer tous les services
start:
	docker-compose up -d --build

# Arrêter tous les services
stop:
	docker-compose down

# Redémarrer tous les services
restart:
	docker-compose down && docker-compose up -d --build

# Afficher les logs
logs:
	docker-compose logs -f

# Afficher les logs d'un service spécifique
logs-%:
	docker-compose logs -f $*

# Nettoyer les volumes (attention, cela supprime toutes les données)
clean:
	docker-compose down -v

# Reconstruire les images
rebuild:
	docker-compose build --no-cache

# Réinitialiser la base de données
db-reset:
	docker-compose exec db psql -U postgres -d belote -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	docker-compose exec db psql -U postgres -d belote -f /docker-entrypoint-initdb.d/init.sql

# Accéder au shell d'un service
shell-%:
	docker-compose exec $* sh

# Accéder à la base de données PostgreSQL
db-shell:
	docker-compose exec db psql -U postgres -d belote

run-fixtures: 
	docker-compose exec backend npm run seed
