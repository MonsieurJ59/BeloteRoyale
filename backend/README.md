# Backend Belote Royale

API pour gérer les tournois de Belote Royale.

## Technologies

- Node.js
- Express
- TypeScript
- PostgreSQL

## Installation

```bash
# Installer les dépendances
npm install

# Compiler le TypeScript
npm run build

# Lancer le serveur
npm start

# Lancer en mode développement
npm run dev
```

## Structure de l'API

### Équipes

- `GET /teams` - Récupérer toutes les équipes
- `GET /teams/:id` - Récupérer une équipe par ID
- `GET /teams/:id/players` - Récupérer les joueurs d'une équipe
- `GET /teams/rankings/all` - Récupérer le classement des équipes
- `POST /teams` - Créer une équipe
  ```json
  {
    "name": "Nom de l'équipe",
    "players": ["Joueur 1", "Joueur 2"]
  }
  ```
- `PATCH /teams/:id` - Mettre à jour une équipe
  ```json
  {
    "name": "Nouveau nom",
    "prelim_points": 100,
    "wins": 3,
    "losses": 1
  }
  ```
- `DELETE /teams/:id` - Supprimer une équipe

### Matchs

- `GET /matches` - Récupérer tous les matchs
- `GET /matches/:id` - Récupérer un match par ID
- `GET /matches/round/:round` - Récupérer les matchs par tour (`preliminaire` ou `principal`)
- `POST /matches` - Créer un match
  ```json
  {
    "round": "preliminaire",
    "team_a_id": 1,
    "team_b_id": 2,
    "score_a": 0,
    "score_b": 0
  }
  ```
- `PATCH /matches/:id` - Mettre à jour un match
  ```json
  {
    "score_a": 120,
    "score_b": 80,
    "winner_id": 1
  }
  ```
- `DELETE /matches/:id` - Supprimer un match
- `POST /matches/generate/preliminary` - Générer les matchs du tour préliminaire
- `POST /matches/generate/main` - Générer les matchs du tour principal

## Flux d'utilisation

1. Créer les équipes avec leurs joueurs
2. Générer les matchs du tour préliminaire
3. Enregistrer les scores des matchs préliminaires
4. Générer les matchs du tour principal
5. Enregistrer les scores et les victoires/défaites du tour principal
6. Consulter le classement final