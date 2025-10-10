# 🧠 Fonctionnement du Frontend - Guide pour débutants

Ce document explique comment fonctionne l'application React de Belote Royale pour aider les débutants à comprendre sa structure et sa logique.

## 📚 Concepts de base de React

Avant de plonger dans le code, voici quelques concepts fondamentaux de React :

- **Composants** : Blocs de construction réutilisables qui encapsulent du code HTML, CSS et JavaScript
- **Props** : Données passées d'un composant parent à un composant enfant
- **State** : Données locales à un composant qui peuvent changer au fil du temps
- **Context** : Mécanisme pour partager des données entre plusieurs composants sans les passer explicitement via les props
- **Hooks** : Fonctions spéciales qui permettent d'utiliser l'état et d'autres fonctionnalités de React dans les composants fonctionnels

## 🗂️ Structure des fichiers

### `/src/main.tsx`
C'est le point d'entrée de l'application. Il monte le composant `App` dans le DOM.

### `/src/App.tsx`
Ce fichier définit la structure principale de l'application :
- Il configure les routes avec **React Router**
- Il enveloppe l'application avec les différents **Context Providers**
- Il définit la mise en page globale avec le composant `Layout`

```jsx
// Structure simplifiée de App.tsx
function App() {
  return (
    <TournamentProvider>
      <TeamProvider>
        <MatchProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                {/* Autres routes... */}
              </Routes>
            </Layout>
          </Router>
        </MatchProvider>
      </TeamProvider>
    </TournamentProvider>
  )
}
```

## 🧩 Composants principaux

### `/src/components/Layout.tsx`
Définit la structure commune à toutes les pages avec :
- La barre de navigation (`Navbar`)
- La barre latérale (`Sidebar`)
- Le pied de page (`Footer`)
- Une zone pour le contenu principal (`children`)

### `/src/components/Navbar.tsx`, `/src/components/Sidebar.tsx`, `/src/components/Footer.tsx`
Composants réutilisables pour les éléments d'interface communs.

### `/src/components/modals/`
Contient les fenêtres modales pour les formulaires :
- `TournamentModal.tsx` : Création/modification de tournois
- `GeneratorMatchModals.tsx` : Génération de matchs

## 📄 Pages

Les pages sont des composants qui représentent des vues complètes de l'application :

### `/src/pages/HomePage.tsx`
Page d'accueil principale avec statistiques et résumé des tournois actifs.

### `/src/pages/TeamsPage.tsx`
Gestion des équipes (liste, création, modification, suppression).

### `/src/pages/TournamentsPage.tsx`
Liste des tournois avec possibilité d'en créer de nouveaux.

### `/src/pages/TournamentDetailPage.tsx`
Détails d'un tournoi spécifique, avec gestion des matchs et des scores.

### `/src/pages/TournamentSummaryPage.tsx`
Résumé et classement d'un tournoi.

### `/src/pages/MatchesPage.tsx`
Liste et gestion des matchs.

## 🔄 Gestion de l'état avec Context API

React Context permet de partager des données entre composants sans les passer explicitement via les props.

### `/src/context/TeamContext.tsx` et `/src/context/TeamContextProvider.tsx`
Gère l'état global des équipes :
- Liste des équipes
- Fonctions pour ajouter, modifier, supprimer des équipes

```jsx
// Exemple simplifié d'utilisation du TeamContext
function TeamsPage() {
  // Récupération des données et fonctions du contexte
  const { teams, addTeam, deleteTeam } = useTeam();
  
  // Utilisation dans le composant
  return (
    <div>
      {teams.map(team => (
        <TeamCard 
          key={team.id} 
          team={team} 
          onDelete={() => deleteTeam(team.id)} 
        />
      ))}
      <button onClick={() => addTeam({ name: "Nouvelle équipe" })}>
        Ajouter une équipe
      </button>
    </div>
  );
}
```

### `/src/context/TournamentContext.tsx`
Gère l'état global des tournois :
- Liste des tournois
- Tournoi actuellement sélectionné
- Fonctions pour créer, modifier, supprimer des tournois

### `/src/context/MatchContext.tsx`
Gère l'état global des matchs :
- Liste des matchs
- Fonctions pour créer, modifier, supprimer des matchs
- Fonctions pour mettre à jour les scores

## 🎨 Styles avec Styled Components

Les styles sont définis avec Styled Components, une bibliothèque qui permet d'écrire du CSS directement dans le JavaScript.

### `/src/styles/`
Contient les fichiers de style pour chaque composant :
- `TeamsPage.styles.ts`
- `TournamentDetailPage.styles.ts`
- etc.

```jsx
// Exemple de Styled Component
import styled from 'styled-components';

export const TeamCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
`;
```

## 🔄 Flux de données

1. **L'utilisateur interagit avec l'interface** (clique sur un bouton, remplit un formulaire...)
2. **Le composant déclenche une action** (fonction du contexte)
3. **Le contexte met à jour son état**
4. **React re-rend les composants** qui utilisent cet état
5. **L'interface est mise à jour** pour refléter le nouvel état

## 📡 Communication avec le backend

L'application communique avec le backend via des appels API REST.

### `/src/config.ts`
Contient la configuration de l'API, notamment l'URL de base.

### Exemple d'appel API dans un contexte

```jsx
// Exemple simplifié d'appel API dans un contexte
const fetchTeams = async () => {
  try {
    const response = await fetch(`${API_URL}/teams`);
    const data = await response.json();
    setTeams(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des équipes:", error);
  }
};
```

## 🧪 Conseils pour débuter

1. **Commencez par comprendre App.tsx** pour voir comment l'application est structurée
2. **Explorez une page simple** comme `TeamsPage.tsx` pour comprendre comment les composants sont organisés
3. **Examinez les contextes** pour comprendre comment les données circulent dans l'application
4. **Modifiez progressivement** en commençant par des changements simples (textes, styles)
5. **Utilisez les outils de développement React** dans votre navigateur pour inspecter les composants et leur état

## 🔍 Exemple concret : Affichage et création d'équipes

1. `App.tsx` définit une route `/teams` qui affiche le composant `TeamsPage`
2. `TeamsPage.tsx` utilise le `TeamContext` pour récupérer la liste des équipes
3. `TeamsPage.tsx` affiche les équipes et un bouton pour en créer de nouvelles
4. Quand l'utilisateur clique sur "Créer une équipe", une modale s'ouvre
5. L'utilisateur remplit le formulaire et soumet
6. La fonction `addTeam` du `TeamContext` est appelée
7. Cette fonction fait un appel API au backend pour créer l'équipe
8. Le `TeamContext` met à jour son état avec la nouvelle équipe
9. React re-rend `TeamsPage` avec la liste mise à jour

## 🚀 Pour aller plus loin

- Explorez le code source en suivant le flux d'une fonctionnalité
- Essayez d'ajouter un petit composant ou une fonctionnalité simple
- Consultez la documentation officielle de React : [https://reactjs.org/docs/getting-started.html](https://reactjs.org/docs/getting-started.html)