// Importation des modules nécessaires
import { createContext, useState, useEffect } from 'react'; // Modules React de base
import type { ReactNode } from 'react'; // Type ReactNode
import type { Tournament } from '../types/api'; // Type Tournament importé depuis le backend

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
    setLoading(true); // Début du chargement
    setError(null); // Réinitialisation des erreurs
    try {
      // Appel à l'API pour récupérer les tournois
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tournaments`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des tournois');
      }
      const data = await response.json();
      
      // Formater les dates pour chaque tournoi
      // Les dates arrivent comme des chaînes de caractères depuis l'API
      // On les convertit en objets Date pour faciliter leur manipulation
      const formattedTournaments = data.map((tournament: any) => ({
        ...tournament, // On garde toutes les propriétés du tournoi
        date: new Date(tournament.date), // On convertit la date en objet Date
        created_at: new Date(tournament.created_at)
      }));
      
      // Mise à jour de l'état avec les tournois formatés
      setTournaments(formattedTournaments);
    } catch (err) {
      // Gestion des erreurs
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération des tournois:', err);
    } finally {
      // Dans tous les cas, on arrête le chargement
      setLoading(false);
    }
  };

  // Effet qui s'exécute au montage du composant pour charger les tournois
  useEffect(() => {
    fetchTournaments(); // Appel initial pour charger les tournois
  }, []); // Tableau de dépendances vide = exécution uniquement au montage

  // Fonction pour créer un nouveau tournoi
  const createTournament = async (tournamentData: CreateTournamentPayload): Promise<Tournament> => {
    try {
      // Formater la date au format YYYY-MM-DD pour MySQL
      const formattedData = {
        ...tournamentData,
        date: tournamentData.date instanceof Date 
          ? tournamentData.date.toISOString().split('T')[0]
          : tournamentData.date
      };
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tournaments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création du tournoi');
      }
      
      const newTournament = await response.json();
      const formattedTournament = {
        ...newTournament,
        date: new Date(newTournament.date),
        created_at: new Date(newTournament.created_at)
      };
      
      setTournaments(prev => [formattedTournament, ...prev]);

      // Inscription des équipes sélectionnées (si fournies)
      if (tournamentData.selected_team_ids && tournamentData.selected_team_ids.length > 0) {
        try {
          await Promise.all(
            tournamentData.selected_team_ids.map(teamId =>
              fetch(`${import.meta.env.VITE_API_URL}/team-tournaments/tournament/${formattedTournament.id}/teams`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ team_id: teamId })
              })
            )
          );
        } catch (err) {
          console.error('Erreur lors de l\'inscription des équipes:', err);
          // On ne bloque pas la création du tournoi si l'inscription échoue pour certaines équipes
        }
      }
      return formattedTournament;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du tournoi';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Fonction pour modifier un tournoi
  const updateTournament = async (id: number, tournamentData: Partial<Omit<Tournament, 'id' | 'created_at'>>): Promise<Tournament> => {
    try {
      // Formater la date au format YYYY-MM-DD pour MySQL si elle existe
      const formattedData = {
        ...tournamentData,
        ...(tournamentData.date && {
          date: tournamentData.date instanceof Date 
            ? tournamentData.date.toISOString().split('T')[0]
            : tournamentData.date
        })
      };
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tournaments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la modification du tournoi');
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tournaments/${id}`, {
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