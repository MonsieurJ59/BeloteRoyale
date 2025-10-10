# 🃏 Belote Royale

Application web pour organiser et gérer des tournois de Belote Royale.  
Front-end en **React + TypeScript**, back-end en **Node.js + Express + TypeScript**, base de données **PostgreSQL**, orchestrés avec **Docker Compose**.

## 🚀 Vue d'ensemble

Belote Royale est une application web permettant d'organiser et de gérer des tournois de belote. Elle offre une interface utilisateur intuitive pour créer des équipes, générer des matchs, enregistrer les scores et visualiser les classements.

## 💻 Technologies utilisées

### Frontend
- **React** avec **TypeScript**
- **Styled Components** pour le styling
- Architecture par composants et pages
- Gestion d'état avec Context API

### Backend
- **Node.js** avec **Express** et **TypeScript**
- API RESTful
- Tests unitaires et end-to-end avec **Jest**

### Base de données
- **MySQL 8**
- Schéma relationnel optimisé pour les tournois

### Infrastructure
- **Docker** et **Docker Compose** pour l'orchestration
- **PHPMyAdmin** pour la gestion de base de données
- **Makefile** pour simplifier les commandes

## 🏗️ Architecture

L'application suit une architecture client-serveur classique :

- **Frontend** : Application React qui communique avec le backend via des appels API
- **Backend** : Serveur Express qui expose des endpoints REST et interagit avec la base de données
- **Base de données** : MySQL stockant toutes les données du tournoi

## 📊 Modèle de données

### Principales entités

- **Teams** : Équipes participant aux tournois
- **Tournaments** : Tournois organisés
- **Matches** : Matchs joués entre les équipes
- **Team Tournament Stats** : Statistiques des équipes par tournoi

## 🎮 Fonctionnalités

### Gestion des équipes
- Création, modification et suppression d'équipes
- Affichage de la liste des équipes
- Gestion des joueurs par équipe

### Gestion des tournois
- Création et configuration de tournois
- Inscription des équipes aux tournois
- Suivi de l'état du tournoi (à venir, en cours, terminé)

### Tours préliminaires
- Génération automatique des matchs préliminaires
- Enregistrement des scores
- Calcul des points cumulés pour chaque équipe

### Tour principal
- Génération de rencontres pour les phases principales
- Gestion des matchs avec système d'élimination
- Enregistrement des scores et détermination des vainqueurs

### Fonctionnalités avancées
- Annulation et régénération des matchs d'une phase
- Modification des scores
- Visualisation de l'avancement du tournoi

### Classement
- Classement par nombre de victoires
- Départage par points des tours préliminaires
- Affichage du podium et du classement complet

## 🛠️ Installation et démarrage

### Prérequis
- Docker et Docker Compose
- Make (optionnel, pour utiliser le Makefile)

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-username/BeloteRoyale.git
cd BeloteRoyale

# Démarrer l'application avec Docker Compose
make start
# ou
docker-compose up -d
```

### Accès à l'application
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:4000
- **PHPMyAdmin** : http://localhost:8082

## 🧪 Tests

L'application dispose de tests unitaires et end-to-end pour garantir son bon fonctionnement.

```bash
# Exécuter tous les tests du backend
make test-backend

# Exécuter uniquement les tests end-to-end
make test-backend-e2e

# Exécuter uniquement les tests unitaires
make test-backend-unit
```

## 📝 Commandes utiles

Le projet inclut un Makefile pour simplifier les opérations courantes :

```bash
# Démarrer les services
make start

# Arrêter les services
make stop

# Redémarrer les services
make restart

# Voir les logs
make logs

# Exécuter les fixtures (données de test)
make fixtures

# Accéder au shell du backend
make shell-backend

# Accéder au shell du frontend
make shell-frontend
```

## 🔄 Flux utilisateur typique

1. Création des équipes
2. Création d'un tournoi et inscription des équipes
3. Génération et déroulement des tours préliminaires
4. Génération et déroulement des tours principaux
5. Visualisation du classement final

## 🚧 Développement futur

- Historique complet des tournois
- Authentification et gestion des utilisateurs
- Export des résultats en PDF/CSV
- Statistiques avancées par joueur et équipe
- Interface mobile optimisée
