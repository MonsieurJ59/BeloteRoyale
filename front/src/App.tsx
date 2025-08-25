// Importation des composants de routage de React Router
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// Importation des styles CSS pour l'application
import './App.css'
// Importation des différentes pages de l'application
import Home from './pages/Home' // Page d'accueil simple avec bouton d'entrée
import HomePage from './pages/HomePage' // Page d'accueil principale avec statistiques
import TournamentsPage from './pages/TournamentsPage' // Page listant tous les tournois
import TournamentDetailPage from './pages/TournamentDetailPage' // Page de détail d'un tournoi spécifique
import TeamsPage from './pages/TeamsPage' // Page de gestion des équipes
import MatchesPage from './pages/MatchesPage' // Page listant tous les matchs
// Importation des fournisseurs de contexte (Context Providers)
import { TournamentProvider } from './context/TournamentContext' // Gestion des données des tournois
import { TeamProvider } from './context/TeamContext' // Gestion des données des équipes
import { MatchProvider } from './context/MatchContext' // Gestion des données des matchs
// Importation des composants de navigation et de pied de page
import Navbar from './components/Navbar' // Barre de navigation
import Footer from './components/Footer' // Pied de page

function App() {
  return (
    // Router: Composant principal qui permet la navigation entre les pages
    <TournamentProvider>
      <TeamProvider>
        <MatchProvider>
          <Router>
            {/* Structure de l'application */}
            <Navbar /> {/* Barre de navigation affichée en haut de toutes les pages */}
            <main> {/* Contenu principal de l'application */}
              <Routes>
                {/* Définition des routes de l'application */}
                {/* Chaque Route associe un chemin URL à un composant React */}
                <Route path="/" element={<HomePage />} /> {/* Page d'accueil principale */}
                <Route path="/welcome" element={<Home />} /> {/* Page d'accueil simple */}
                <Route path="/tournaments" element={<TournamentsPage />} /> {/* Liste des tournois */}
                <Route path="/tournament/:id" element={<TournamentDetailPage />} /> {/* Détail d'un tournoi (avec paramètre id) */}
                <Route path="/teams" element={<TeamsPage />} /> {/* Gestion des équipes */}
                <Route path="/matches" element={<MatchesPage />} /> {/* Liste des matchs */}
                <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirection pour les routes non trouvées */}
              </Routes>
            </main>
            <Footer /> {/* Pied de page affiché en bas de toutes les pages */}
          </Router>
        </MatchProvider>
      </TeamProvider>
    </TournamentProvider>
  )
}

export default App
