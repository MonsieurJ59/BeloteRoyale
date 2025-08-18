FROM node:20

# Répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package*.json ./
RUN npm install

# Copier la config TypeScript et le code source
COPY tsconfig.json ./
COPY src ./src

# Exposer le port
EXPOSE 4000

# Lancer le serveur en mode dev (tsx watch)
CMD ["npm", "run", "dev"]
