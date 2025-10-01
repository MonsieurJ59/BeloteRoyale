FROM node:20-alpine

# Installer netcat pour les health checks
RUN apk add --no-cache netcat-openbsd

# Répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers de dépendances pour optimiser le cache Docker
COPY package*.json ./

# Installer toutes les dépendances
RUN npm ci --only=production=false

# Copier la config TypeScript
COPY tsconfig.json ./

# Copier le code source
COPY src ./src

# Exposer le port
EXPOSE 4000

# Variables d'environnement par défaut
ENV PORT=4000

# Script de démarrage qui attend MySQL
CMD ["sh", "-c", "while ! nc -z mysql 3306; do echo 'Waiting for MySQL...'; sleep 2; done && echo 'MySQL is ready!' && npm run dev"]
