FROM node:20 as builder

# Répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package*.json ./
RUN npm install

# Copier la config TypeScript et le code source
COPY tsconfig.json ./
COPY src ./src

# Compiler le TypeScript
RUN npm run build

# Étape de production
FROM node:20-slim

WORKDIR /app

# Copier uniquement les fichiers nécessaires pour la production
COPY package*.json ./
RUN npm install --production

# Copier les fichiers compilés depuis l'étape de build
COPY --from=builder /app/dist ./dist

# Exposer le port
EXPOSE 4000

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=4000

# Lancer le serveur en mode production
CMD ["npm", "start"]
