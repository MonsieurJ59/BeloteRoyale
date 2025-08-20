# 🃏 Belote Royale

Application web pour organiser et gérer des tournois de Belote Royale.  
Front-end en **React + TypeScript**, back-end en **Node.js + Express + TypeScript**, base de données **PostgreSQL**, orchestrés avec **Docker Compose**.

---

## 🚀 Fonctionnalités

### Gestion des équipes
- Créer une équipe (nom + joueurs)
- Modifier / supprimer une équipe
- Afficher la liste des équipes

### Tours préliminaires (5 manches sans annonces)
- Génération des matchs (toutes les équipes jouent)
- Enregistrement des scores
- Stockage des points cumulés pour chaque équipe

### Tour principal (avec annonces)
- Génération de rencontres aléatoires (limiter les re-rencontres)
- 5 parties avec annonces
- Enregistrement :
  - Scores (A et B)
  - Victoire / défaite

### Classement final
- Classement par nombre de victoires
- Départage par points des **tours préliminaires**
- Affichage du podium et du classement complet

### Fonctionnalités futures (optionnel)
- Historique des tournois
- Authentification (gestion par un admin)
- Export des résultats (PDF/CSV)

---

## 🗃️ Modèle de données (PostgreSQL)

### Table `teams` (équipes)
| Colonne        | Type       | Description |
|----------------|-----------|-------------|
| `id`           | SERIAL PK | Identifiant unique |
| `name`         | VARCHAR   | Nom de l’équipe |
| `prelim_points`| INT       | Points tours préliminaires |
| `wins`         | INT       | Victoires tour principal |
| `losses`       | INT       | Défaites tour principal |

---

### Table `players` (joueurs, optionnelle)
| Colonne    | Type       | Description |
|------------|-----------|-------------|
| `id`       | SERIAL PK | Identifiant unique |
| `name`     | VARCHAR   | Nom du joueur |
| `team_id`  | INT FK    | Référence vers `teams.id` |

---

### Table `matches` (matchs)
| Colonne    | Type       | Description |
|------------|-----------|-------------|
| `id`       | SERIAL PK | Identifiant unique |
| `round`    | VARCHAR   | `"preliminaire"` ou `"principal"` |
| `team_a_id`| INT FK    | ID équipe A |
| `team_b_id`| INT FK    | ID équipe B |
| `score_a`  | INT       | Score équipe A |
| `score_b`  | INT       | Score équipe B |
| `winner_id`| INT FK    | ID équipe gagnante (nullable si égalité) |

---

## 🔗 Relations
- 1 équipe → plusieurs joueurs (`teams` → `players`)
- 1 match → 2 équipes (`matches` → `teams`)

---

## 📊 Flux utilisateur

1. Création des équipes
2. **Tours préliminaires** : 5 manches, on enregistre les points
3. **Tour principal** : 5 parties avec annonces, matchs aléatoires
4. Classement final :
   - Trié par **victoires**
   - Départagé par **points préliminaires**

---
