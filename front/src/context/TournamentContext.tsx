// Importation des modules nécessaires
import { createContext, useState, useEffect } from 'react'; // Modules React de base
import type { ReactNode } from 'react'; // Type ReactNode
import type { Tournament } from '../types/api'; // Type Tournament importé depuis le backend
import { API_URL } from '../config'; // Configuration API centralisée

// Payload étendue pour la création d'un tournoi (avec configs et équipes sélectionnées)
type CreateTournamentPayload = Omit<Tournament, 'id' | 'created_at'> & {
  match_configs?: any[];
  selected_team_ids?: number[];
};

// Interface définissant la structure du contexte des tournois
// Cette interface définit ce que les composants pourront utiliser via useContext
interface TournamentContextType {
  tournaments: Tournament[]; // Liste des tournois disponibles
  loading: boolean; // Indicateur de chargement
  error: string | null; // Message d'erreur éventuel
  fetchTournaments: () => Promise<void>; // Fonction pour récupérer les tournois
  createTournament: (tournament: CreateTournamentPayload) => Promise<Tournament>;
  updateTournament: (id: number, tournament: Partial<Omit<Tournament, 'id' | 'created_at'>>) => Promise<Tournament>;
  deleteTournament: (id: number) => Promise<void>;
}

// Création du contexte avec des valeurs par défaut
// Ces valeurs seront remplacées par le Provider
export const TournamentContext = createContext<TournamentContextType>({
  tournaments: [],
  loading: false,
  error: null,
  fetchTournaments: async () => {},
  createTournament: async () => { throw new Error('Not implemented'); },
  updateTournament: async () => { throw new Error('Not implemented'); },
  deleteTournament: async () => { throw new Error('Not implemented'); },
});

// Interface pour les props du Provider
interface TournamentProviderProps {
  children: ReactNode; // Les composants enfants qui auront accès au contexte
}

// Composant Provider qui va fournir le contexte à ses enfants
export const TournamentProvider: React.FC<TournamentProviderProps> = ({ children }) => {
  // États locaux pour gérer les données et l'état de l'application
  const [tournaments, setTournaments] = useState<Tournament[]>([]); // Liste des tournois
  const [loading, setLoading] = useState<boolean>(true); // État de chargement initial à true
  const [error, setError] = useState<string | null>(null); // Pas d'erreur initialement

  // Fonction pour récupérer tous les tournois depuis l'API
  const fetchTournaments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/tournaments`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des tournois');
      }
      const data = await response.json();
      setTournaments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Effet qui s'exécute au montage du composant pour charger les tournois
  useEffect(() => {
    fetchTournaments(); // Appel initial pour charger les tournois
  }, []); // Tableau de dépendances vide = exécution uniquement au montage

  // Fonction pour créer un nouveau tournoi
  const createTournament = async (tournament: CreateTournamentPayload): Promise<Tournament> => {
    try {
      setLoading(true);
      setError(null);
      
      // Créer le tournoi
      const response = await fetch(`${API_URL}/tournaments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tournament),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du tournoi');
      }

      const newTournament = await response.json();

      // Inscrire les équipes sélectionnées au tournoi
      if (tournament.selected_team_ids && tournament.selected_team_ids.length > 0) {
        await Promise.all(
          tournament.selected_team_ids.map(teamId =>
            fetch(`${API_URL}/team-tournaments/tournament/${newTournament.id}/teams`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ team_id: teamId }),
            })
          )
        );
      }
      return formattedTournament;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du tournoi';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Fonction pour modifier un tournoi
  const updateTournament = async (id: number, tournament: Partial<Omit<Tournament, 'id' | 'created_at'>>): Promise<Tournament> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/tournaments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tournament),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du tournoi');
      }

      const updatedTournament = await response.json();
      const formattedTournament = {
        ...updatedTournament,
        date: new Date(updatedTournament.date),
        created_at: new Date(updatedTournament.created_at)
      };
      
      setTournaments(prev => prev.map(t => t.id === id ? formattedTournament : t));
      return formattedTournament;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la modification du tournoi';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Fonction pour supprimer un tournoi
  const deleteTournament = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/tournaments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du tournoi');
      }
      
      setTournaments(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression du tournoi';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Rendu du Provider avec les valeurs du contexte
  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        loading,
        error,
        fetchTournaments,
        createTournament,
        updateTournament,
        deleteTournament,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};