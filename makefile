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

# Analyser un tournoi terminé
analyze-end-tournament:
	docker-compose exec backend npx ts-node src/scripts/analyze-tournament.ts

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


# 🧪 Tests du backend
.PHONY: test-backend test-backend-watch test-backend-e2e test-backend-unit

# Exécuter tous les tests du backend
test-backend:
	docker-compose exec backend sh -c "cd /app && npm install ts-jest && npm test"

# Exécuter les tests en mode watch
test-backend-watch:
	docker-compose exec backend sh -c "cd /app && npm install ts-jest && npm run test:watch"

# Exécuter uniquement les tests end-to-end
test-backend-e2e:
	docker-compose exec backend sh -c "cd /app && npm install ts-jest && npm run test:e2e"

# Exécuter uniquement les tests e2e stables
test-backend-e2e-stable:
	docker-compose exec backend sh -c "cd /app && npm install ts-jest && npm run test:e2e:stable"

# Exécuter les tests e2e en développement (sans les tests de flux complet)
test-backend-e2e-dev:
	docker-compose exec backend sh -c "cd /app && npm install ts-jest && npm run test:e2e:dev"

# Exécuter uniquement les tests unitaires
test-backend-unit:
	docker-compose exec backend sh -c "cd /app && npm install ts-jest && npm run test:unit"

# Exécuter un test spécifique
test-backend-file:
	@read -p "Entrez le chemin du fichier de test (ex: tests/e2e/tournament-flow.test.ts): " file_path; \
	docker-compose exec backend sh -c "cd /app && npm install ts-jest && npx jest $$file_path"