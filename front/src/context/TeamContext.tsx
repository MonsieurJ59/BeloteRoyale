// Importation des modules nécessaires
import { createContext } from 'react'; // Importation de createContext uniquement
import type { Team } from '../types/types'; // Type Team défini dans notre application

// Interface définissant la structure du contexte des équipes
// Cette interface définit ce que les composants pourront utiliser via useContext
export interface TeamContextType {
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