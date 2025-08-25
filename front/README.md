# Belote Royale - Frontend

Interface utilisateur pour l'application Belote Royale, permettant de gérer des tournois de belote.

## Technologies utilisées

- React 18
- TypeScript
- Vite
- React Router
- Styled Components

## Fonctionnalités

- Gestion des tournois (création, visualisation, mise à jour)
- Gestion des équipes
- Suivi des matchs et des scores
- Classements des équipes

## Installation

1. Clonez le dépôt
2. Installez les dépendances :

```bash
npm install
```

3. Copiez le fichier `.env.example` en `.env` et configurez les variables d'environnement :

```bash
cp .env.example .env
```

## Développement

Pour lancer le serveur de développement :

```bash
npm run dev
```

L'application sera disponible à l'adresse [http://localhost:5173](http://localhost:5173).

## Structure du projet

```
src/
├── components/     # Composants réutilisables
├── context/        # Contextes React pour la gestion d'état
├── pages/          # Pages de l'application
├── types/          # Définitions de types TypeScript
├── utils/          # Fonctions utilitaires
├── App.tsx         # Composant principal
└── main.tsx        # Point d'entrée
```

## Communication avec le backend

L'application communique avec le backend via une API REST. L'URL de base de l'API est configurée dans le fichier `.env` avec la variable `VITE_API_URL`.

## Build de production

Pour créer une version de production :

```bash
npm run build
```

Les fichiers générés seront disponibles dans le dossier `dist/`.

## Docker

L'application peut être exécutée via Docker en utilisant le fichier `docker-compose.yml` à la racine du projet.

```bash
docker-compose up
```
