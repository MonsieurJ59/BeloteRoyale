FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances pour optimiser le cache
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 5173

# Vite doit écouter sur 0.0.0.0 en conteneur
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
