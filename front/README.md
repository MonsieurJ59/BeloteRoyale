
## 📱 Pages principales

- **HomePage** - Page d'accueil avec présentation de l'application
- **TeamsPage** - Gestion des équipes (création, modification, suppression)
- **TournamentsPage** - Liste et création des tournois
- **TournamentDetailPage** - Détails d'un tournoi spécifique
- **MatchesPage** - Affichage et gestion des matchs
- **TournamentSummaryPage** - Résumé et classement d'un tournoi

## 🧩 Composants clés

- **Layout** - Structure globale de l'application
- **Navbar** - Barre de navigation principale
- **Sidebar** - Menu latéral pour la navigation contextuelle
- **Footer** - Pied de page avec informations complémentaires
- **Modals** - Fenêtres modales pour les formulaires (équipes, tournois, matchs)

## 🔄 Gestion d'état

L'application utilise le Context API de React pour gérer l'état global :

- **TeamContext** - Gestion des équipes
- **TournamentContext** - Gestion des tournois
- **MatchContext** - Gestion des matchs

## 🎨 Styles

Les styles sont gérés avec Styled Components, organisés par composant dans le dossier `styles/`. Un thème global (`theme.ts`) définit les couleurs, typographies et espacements pour une cohérence visuelle.

## 🚀 Fonctionnalités principales

### Gestion des équipes
- Création d'équipes avec nom et joueurs
- Modification et suppression d'équipes
- Affichage de la liste des équipes

### Gestion des tournois
- Création de nouveaux tournois
- Configuration des paramètres du tournoi
- Inscription des équipes aux tournois
- Suivi de l'état du tournoi

### Gestion des matchs
- Génération automatique des matchs préliminaires
- Création des matchs pour les phases principales
- Saisie et modification des scores
- Visualisation des résultats

### Classement et statistiques
- Affichage du classement des équipes
- Statistiques par équipe et par tournoi
- Résumé des performances

## 🔧 Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm run lint` - Vérifie le code avec ESLint
- `npm run preview` - Prévisualise la version de production

## 🌐 Communication avec le backend

L'application communique avec le backend via des appels API REST. Les types d'API sont définis dans `types/api.ts` pour assurer la cohérence des données.

## 🧪 Bonnes pratiques

- **TypeScript** pour un typage strict
- **ESLint** pour la qualité du code
- **Architecture par composants** pour la réutilisabilité
- **Styled Components** pour l'isolation des styles
- **Context API** pour une gestion d'état claire