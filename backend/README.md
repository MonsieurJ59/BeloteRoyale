# Backend API - Belote Royale

API REST pour l'application de gestion de tournois de belote Belote Royale.

## 🛠️ Stack Technique

- **Node.js** avec **TypeScript** - Runtime et langage
- **Express.js** - Framework web pour l'API REST
- **MySQL** - Base de données relationnelle
- **Docker** - Conteneurisation de l'application

## 📁 Structure du Projet

```
backend/
├── src/
│   ├── routes/           # Routes de l'API
│   │   ├── teams.ts      # Gestion des équipes
│   │   ├── matches.ts    # Gestion des matchs
│   │   ├── tournaments.ts # Gestion des tournois
│   │   └── teamTournamentStats.ts # Statistiques équipes/tournois
│   ├── scripts/
│   │   └── seed.ts       # Script de peuplement de la base
│   ├── db.ts            # Configuration de la base de données
│   ├── types.ts         # Définitions TypeScript
│   └── index.ts         # Point d'entrée de l'application
├── Dockerfile           # Configuration Docker
├── package.json         # Dépendances et scripts
├── tsconfig.json        # Configuration TypeScript
└── .env.example         # Variables d'environnement exemple
```


## 🚀 Démarrage Rapide

### Prérequis

- Node.js (v20 ou supérieur)
- Base de données MySQL
- Docker (optionnel)

### Installation

1. **Installer les dépendances :**
   ```bash
   npm install
   ```

2. **Configurer l'environnement :**
   ```bash
   cp .env.example .env
   ```
   Puis modifier le fichier `.env` avec vos paramètres de base de données.

3. **Démarrer le serveur de développement :**
   ```bash
   npm run dev
   ```

L'API sera accessible sur `http://localhost:4000`

### 🐳 Utilisation avec Docker

```bash
docker build -t belote-backend .
docker run -p 4000:4000 belote-backend
```

## 📊 Architecture de l'API

### Point de Santé
- `GET /health` - Vérification du statut de l'API

### 👥 Équipes (`/teams`)
- `GET /teams` - Récupérer toutes les équipes
- `POST /teams` - Créer une nouvelle équipe
- `GET /teams/:id` - Récupérer une équipe spécifique
- `PUT /teams/:id` - Modifier une équipe
- `DELETE /teams/:id` - Supprimer une équipe

### 🎯 Matchs (`/matches`)
- `GET /matches` - Récupérer tous les matchs
- `POST /matches` - Créer un nouveau match
- `GET /matches/:id` - Récupérer un match spécifique
- `PUT /matches/:id` - Modifier un match
- `DELETE /matches/:id` - Supprimer un match

### 🏆 Tournois (`/tournaments`)
- `GET /tournaments` - Récupérer tous les tournois
- `POST /tournaments` - Créer un nouveau tournoi
- `GET /tournaments/:id` - Récupérer un tournoi spécifique
- `PUT /tournaments/:id` - Modifier un tournoi
- `DELETE /tournaments/:id` - Supprimer un tournoi

### 📈 Statistiques (`/team-tournament-stats`)
- `GET /team-tournament-stats` - Récupérer toutes les statistiques
- `POST /team-tournament-stats` - Créer de nouvelles statistiques
- `GET /team-tournament-stats/:id` - Récupérer des statistiques spécifiques
- `PUT /team-tournament-stats/:id` - Modifier des statistiques
- `DELETE /team-tournament-stats/:id` - Supprimer des statistiques
