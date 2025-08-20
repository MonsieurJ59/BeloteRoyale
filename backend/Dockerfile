FROM node:20

# Répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package*.json ./

# Installer toutes les dépendances (y compris les dépendances de développement)
RUN npm install

# Copier la config TypeScript et le code source
COPY tsconfig.json ./
COPY src ./src

# Exposer le port
EXPOSE 4000

# Variables d'environnement par défaut
ENV PORT=4000

# Lancer le serveur en mode développement
CMD ["npm", "run", "dev"]
