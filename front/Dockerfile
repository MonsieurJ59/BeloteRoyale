FROM node:20

WORKDIR /app

# Installer uniquement d'abord pour profiter du cache
COPY package*.json ./
RUN npm install

# Copier le reste du code
COPY . .

# Vite doit écouter sur 0.0.0.0 en conteneur
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
