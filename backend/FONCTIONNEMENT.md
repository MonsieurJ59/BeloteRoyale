# 🧠 Fonctionnement du Backend - Guide pour débutants

Ce document explique comment fonctionne le backend de Belote Royale de manière simple et accessible pour les débutants.

## 📚 Concepts de base

Avant de plonger dans le code, voici quelques concepts fondamentaux :

- **API REST** : Interface permettant à différentes applications de communiquer entre elles via HTTP
- **Endpoint** : URL spécifique qui permet d'accéder à une ressource ou d'effectuer une action
- **Route** : Définition du chemin et du comportement d'un endpoint
- **Middleware** : Fonction qui traite les requêtes avant qu'elles n'atteignent leur destination finale
- **Base de données** : Système de stockage organisé des données

## 🗂️ Structure des fichiers

### `/src/index.ts`
C'est le point d'entrée de l'application. Il :
- Configure le serveur Express
- Définit les middlewares globaux (CORS, JSON parser)
- Enregistre les différentes routes
- Démarre le serveur sur le port spécifié

```javascript
// Structure simplifiée de index.ts
import express from "express";
import cors from "cors";
import teamsRouter from "./routes/teams";
// Autres imports...

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/teams", teamsRouter);
app.use("/matches", matchesRouter);
// Autres routes...

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
```

### `/src/db.ts`
Configure la connexion à la base de données MySQL :
- Crée un pool de connexions
- Fournit des fonctions pour exécuter des requêtes SQL

### `/src/types.ts`
Définit les types TypeScript pour les différentes entités de l'application :
- Teams (équipes)
- Tournaments (tournois)
- Matches (matchs)
- TeamTournamentStats (statistiques des équipes par tournoi)

## 📁 Dossiers principaux

### `/src/routes/`
Contient les fichiers définissant les routes de l'API pour chaque entité :

#### `/src/routes/teams.ts`
Gère les opérations CRUD (Create, Read, Update, Delete) pour les équipes :
- `GET /teams` : Récupérer toutes les équipes
- `POST /teams` : Créer une nouvelle équipe
- `GET /teams/:id` : Récupérer une équipe spécifique
- `PUT /teams/:id` : Modifier une équipe
- `DELETE /teams/:id` : Supprimer une équipe

```javascript
// Exemple simplifié d'une route
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM teams");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des équipes" });
  }
});
```

#### `/src/routes/tournaments.ts`
Gère les opérations CRUD pour les tournois.

#### `/src/routes/matches.ts`
Gère les opérations CRUD pour les matchs.

#### `/src/routes/teamTournamentStats.ts`
Gère les opérations CRUD pour les statistiques des équipes par tournoi.

### `/src/scripts/`
Contient des scripts utilitaires :
- `seed.ts` : Script pour peupler la base de données avec des données initiales

## 🔄 Flux d'une requête

Voici comment une requête est traitée par le backend :

1. **Le client envoie une requête HTTP** à un endpoint spécifique (ex: `GET /teams`)
2. **Express reçoit la requête** et la fait passer par les middlewares globaux
   - CORS : Autorise les requêtes cross-origin
   - JSON Parser : Parse le corps de la requête en JSON
3. **La requête est dirigée vers la route appropriée** en fonction de son URL
4. **Le gestionnaire de route traite la requête** :
   - Exécute une requête SQL vers la base de données
   - Traite les données reçues
   - Prépare la réponse
5. **La réponse est envoyée au client** avec un code de statut HTTP approprié

## 💾 Base de données

L'application utilise MySQL comme système de gestion de base de données. Les principales tables sont :

- **teams** : Stocke les informations sur les équipes
- **tournaments** : Stocke les informations sur les tournois
- **matches** : Stocke les informations sur les matchs
- **team_tournament_stats** : Stocke les statistiques des équipes par tournoi

## 🧪 Tests

Les tests sont organisés dans le dossier `/tests/` :

- **Tests unitaires** : Testent des fonctions spécifiques
- **Tests e2e** : Testent l'API de bout en bout en simulant des requêtes HTTP

## 🔍 Exemple concret : Création d'une équipe

Voici comment fonctionne la création d'une équipe :

1. Le client envoie une requête `POST /teams` avec les données de l'équipe
2. Express reçoit la requête et la parse en JSON
3. La requête est dirigée vers la route `POST /teams`
4. Le gestionnaire de route :
   - Valide les données reçues
   - Exécute une requête SQL `INSERT INTO teams`
   - Récupère l'ID de la nouvelle équipe
   - Renvoie les données de l'équipe créée
5. Le client reçoit la réponse avec les données de l'équipe et un code 201 (Created)

## 🚀 Conseils pour débuter

1. **Commencez par comprendre index.ts** pour voir comment l'application est structurée
2. **Explorez une route simple** comme `teams.ts` pour comprendre comment les requêtes sont traitées
3. **Examinez db.ts** pour comprendre comment l'application interagit avec la base de données
4. **Modifiez progressivement** en commençant par des changements simples (ajout d'un champ, modification d'une requête)
5. **Utilisez Postman ou un outil similaire** pour tester vos modifications

## 📡 Communication avec le frontend

Le backend communique avec le frontend via des requêtes HTTP :

1. Le frontend envoie une requête HTTP à un endpoint du backend
2. Le backend traite la requête et renvoie une réponse
3. Le frontend utilise les données reçues pour mettre à jour l'interface utilisateur

## 🔧 Variables d'environnement

L'application utilise des variables d'environnement pour la configuration :

- `PORT` : Port sur lequel le serveur écoute
- `DB_HOST` : Hôte de la base de données
- `DB_USER` : Utilisateur de la base de données
- `DB_PASSWORD` : Mot de passe de la base de données
- `DB_NAME` : Nom de la base de données

Ces variables sont définies dans le fichier `.env` (ou via Docker).

## 🐳 Docker

L'application peut être exécutée dans un conteneur Docker, ce qui simplifie le déploiement et garantit un environnement cohérent.

Le `Dockerfile` définit comment construire l'image Docker pour le backend.

## 🚀 Pour aller plus loin

- Explorez le code source en suivant le flux d'une fonctionnalité
- Essayez d'ajouter un nouvel endpoint ou de modifier un existant
- Consultez la documentation officielle d'Express : [https://expressjs.com/fr/](https://expressjs.com/fr/)
- Apprenez plus sur les bases de données relationnelles et SQL