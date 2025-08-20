# Structure de la base de données BeloteRoyale

## Modifications apportées

La structure de la base de données a été modifiée pour prendre en charge la gestion des tournois. Voici les principales modifications :

### Nouvelles tables

1. **tournaments** : Stocke les informations sur les tournois
   - `id` : Identifiant unique du tournoi
   - `name` : Nom du tournoi
   - `date` : Date du tournoi
   - `status` : Statut du tournoi (upcoming, in_progress, completed)
   - `created_at` : Date de création du tournoi

2. **team_tournament_stats** : Stocke les statistiques des équipes par tournoi
   - `id` : Identifiant unique
   - `team_id` : Référence à l'équipe
   - `tournament_id` : Référence au tournoi
   - `prelim_points` : Points préliminaires de l'équipe dans ce tournoi
   - `wins` : Nombre de victoires de l'équipe dans ce tournoi
   - `losses` : Nombre de défaites de l'équipe dans ce tournoi

### Modifications des tables existantes

1. **teams** : Suppression des champs suivants qui sont maintenant dans team_tournament_stats
   - `prelim_points`
   - `wins`
   - `losses`

2. **matches** : Ajout d'une référence au tournoi
   - `tournament_id` : Référence au tournoi auquel appartient le match

## Migration des données

Un script de migration (`migration.sql`) a été créé pour :

1. Créer un tournoi par défaut pour les données existantes
2. Migrer les statistiques des équipes vers la nouvelle table team_tournament_stats
3. Mettre à jour les matchs existants pour les associer au tournoi par défaut

## Nouvelles fonctionnalités

Ces modifications permettent de :

1. Organiser plusieurs tournois
2. Suivre les statistiques des équipes par tournoi
3. Générer des matchs préliminaires et principaux pour chaque tournoi
4. Afficher le classement des équipes par tournoi ou global