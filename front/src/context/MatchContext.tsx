// Importation des modules nécessaires
import { createContext, useState, useEffect } from 'react'; // Modules React de base
import type { ReactNode } from 'react'; // Type ReactNode
import type { Match } from '../types/api'; // Type Match importé depuis le backend
import { API_URL } from '../config'; // URL de l'API depuis la configuration

// Interface définissant la structure du contexte des matchs
// Cette interface définit ce que les composants pourront utiliser via useContext
interface MatchContextType {
  matches: Match[]; // Liste des matchs disponibles
  loading: boolean; // Indicateur de chargement
  error: string | null; // Message d'erreur éventuel
  fetchMatches: () => Promise<void>; // Fonction pour récupérer les matchs
  updateMatchScore: (matchId: number, scoreA: number, scoreB: number) => Promise<void>; // Fonction pour mettre à jour un score
}

// Création du contexte avec des valeurs par défaut
// Ces valeurs seront remplacées par le Provider
export const MatchContext = createContext<MatchContextType>({
  matches: [],
  loading: false,
  error: null,
  fetchMatches: async () => {}, // Fonction vide par défaut
  updateMatchScore: async () => {}, // Fonction vide par défaut
});

// Interface pour les props du Provider
interface MatchProviderProps {
  children: ReactNode; // Les composants enfants qui auront accès au contexte
}

// Composant Provider qui va fournir le contexte à ses enfants
export const MatchProvider: React.FC<MatchProviderProps> = ({ children }) => {
  // États locaux pour gérer les données et l'état de l'application
  const [matches, setMatches] = useState<Match[]>([]); // Liste des matchs
  const [loading, setLoading] = useState<boolean>(true); // État de chargement initial à true
  const [error, setError] = useState<string | null>(null); // Pas d'erreur initialement

  // Fonction pour récupérer tous les matchs depuis l'API
  const fetchMatches = async () => {
    setLoading(true); // Début du chargement
    setError(null); // Réinitialisation des erreurs
    try {
      // Appel à l'API pour récupérer les matchs
      const response = await fetch(`${API_URL}/matches`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des matchs');
      }
      const data = await response.json();
      setMatches(data); // Mise à jour de l'état avec les données reçues
    } catch (err) {
      // Gestion des erreurs
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération des matchs:', err);
    } finally {
      // Dans tous les cas, on arrête le chargement
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour le score d'un match
  const updateMatchScore = async (matchId: number, scoreA: number, scoreB: number) => {
    setLoading(true); // Début du chargement
    setError(null); // Réinitialisation des erreurs
    try {
      // Logique pour déterminer l'équipe gagnante
      let winnerId = null;
      if (scoreA > scoreB) {
        // Si l'équipe A a un score plus élevé, elle est gagnante
        const match = matches.find(m => m.id === matchId);
        if (match) {
          winnerId = match.team_a_id;
        }
      } else if (scoreB > scoreA) {
        // Si l'équipe B a un score plus élevé, elle est gagnante
        const match = matches.find(m => m.id === matchId);
        if (match) {
          winnerId = match.team_b_id;
        }
      }
      // Si les scores sont égaux, winnerId reste null (match nul)

      // Appel à l'API pour mettre à jour le match
      const response = await fetch(`${API_URL}/matches/${matchId}`, {
        method: 'PUT', // Méthode HTTP PUT pour la mise à jour
        headers: {
          'Content-Type': 'application/json', // Format JSON
        },
        body: JSON.stringify({
          score_a: scoreA,
          score_b: scoreB,
          winner_id: winnerId, // ID de l'équipe gagnante ou null
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du score');
      }

      // Mise à jour de l'état local avec le match modifié
      const updatedMatch = await response.json();
      setMatches(prevMatches =>
        prevMatches.map(match =>
          match.id === matchId ? updatedMatch : match // Remplace uniquement le match modifié
        )
      );
    } catch (err) {
      // Gestion des erreurs
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la mise à jour du score:', err);
    } finally {
      // Dans tous les cas, on arrête le chargement
      setLoading(false);
    }
  };

  // Effet qui s'exécute au montage du composant pour charger les matchs
  useEffect(() => {
    fetchMatches(); // Appel initial pour charger les matchs
  }, []); // Tableau de dépendances vide = exécution uniquement au montage

  // Rendu du Provider avec les valeurs du contexte
  return (
    <MatchContext.Provider
      value={{
        matches, // Liste des matchs
        loading, // État de chargement
        error, // Message d'erreur éventuel
        fetchMatches, // Fonction pour récupérer les matchs
        updateMatchScore, // Fonction pour mettre à jour un score
      }}
    >
      {children} {/* Rendu des composants enfants */}
    </MatchContext.Provider>
  );
};