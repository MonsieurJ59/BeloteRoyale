// Importation des modules nécessaires
import React, { createContext, useState, useEffect, ReactNode } from 'react'; // Modules React de base
import { Team } from '../types/types'; // Type Team défini dans notre application
import { API_URL } from '../config'; // URL de l'API depuis la configuration

// Interface définissant la structure du contexte des équipes
// Cette interface définit ce que les composants pourront utiliser via useContext
interface TeamContextType {
  teams: Team[]; // Liste des équipes disponibles
  loading: boolean; // Indicateur de chargement
  error: string | null; // Message d'erreur éventuel
  fetchTeams: () => Promise<void>; // Fonction pour récupérer les équipes
  addTeam: (name: string, player1: string, player2: string) => Promise<void>; // Fonction pour ajouter une équipe
}

// Création du contexte avec des valeurs par défaut
// Ces valeurs seront remplacées par le Provider
export const TeamContext = createContext<TeamContextType>({
  teams: [],
  loading: false,
  error: null,
  fetchTeams: async () => {}, // Fonction vide par défaut
  addTeam: async () => {}, // Fonction vide par défaut
});

// Interface pour les props du Provider
interface TeamProviderProps {
  children: ReactNode; // Les composants enfants qui auront accès au contexte
}

// Composant Provider qui va fournir le contexte à ses enfants
export const TeamProvider: React.FC<TeamProviderProps> = ({ children }) => {
  // États locaux pour gérer les données et l'état de l'application
  const [teams, setTeams] = useState<Team[]>([]); // Liste des équipes
  const [loading, setLoading] = useState<boolean>(true); // État de chargement initial à true
  const [error, setError] = useState<string | null>(null); // Pas d'erreur initialement

  // Fonction pour récupérer toutes les équipes depuis l'API
  const fetchTeams = async () => {
    setLoading(true); // Début du chargement
    setError(null); // Réinitialisation des erreurs
    try {
      // Appel à l'API pour récupérer les équipes
      const response = await fetch(`${API_URL}/teams`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des équipes');
      }
      const data = await response.json();
      setTeams(data); // Mise à jour de l'état avec les données reçues
    } catch (err) {
      // Gestion des erreurs
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      // Dans tous les cas, on arrête le chargement
      setLoading(false);
    }
  };

  // Fonction pour ajouter une nouvelle équipe
  const addTeam = async (name: string, player1: string, player2: string) => {
    setLoading(true); // Début du chargement
    setError(null); // Réinitialisation des erreurs
    try {
      // Appel à l'API pour créer une nouvelle équipe
      const response = await fetch(`${API_URL}/teams`, {
        method: 'POST', // Méthode HTTP POST pour la création
        headers: {
          'Content-Type': 'application/json', // Format JSON
        },
        body: JSON.stringify({
          name, // Nom de l'équipe
          player1, // Nom du premier joueur
          player2, // Nom du deuxième joueur
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'équipe');
      }

      // Récupération de l'équipe créée depuis la réponse
      const newTeam = await response.json();
      // Mise à jour de l'état local en ajoutant la nouvelle équipe
      setTeams(prevTeams => [...prevTeams, newTeam]);
      return newTeam; // Retourne l'équipe créée pour utilisation éventuelle
    } catch (err) {
      // Gestion des erreurs
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err; // Propage l'erreur pour gestion dans le composant appelant
    } finally {
      // Dans tous les cas, on arrête le chargement
      setLoading(false);
    }
  };

  // Effet qui s'exécute au montage du composant pour charger les équipes
  useEffect(() => {
    fetchTeams(); // Appel initial pour charger les équipes
  }, []); // Tableau de dépendances vide = exécution uniquement au montage

  // Rendu du Provider avec les valeurs du contexte
  return (
    <TeamContext.Provider
      value={{
        teams, // Liste des équipes
        loading, // État de chargement
        error, // Message d'erreur éventuel
        fetchTeams, // Fonction pour récupérer les équipes
        addTeam, // Fonction pour ajouter une équipe
      }}
    >
      {children} {/* Rendu des composants enfants */}
    </TeamContext.Provider>
  );
};