// Importation des modules nécessaires
import React, { createContext, useState, useEffect, ReactNode } from 'react'; // Modules React de base
import type { Tournament } from '../types/types'; // Type Tournament défini dans notre application

// Interface définissant la structure du contexte des tournois
// Cette interface définit ce que les composants pourront utiliser via useContext
interface TournamentContextType {
  tournaments: Tournament[]; // Liste des tournois disponibles
  loading: boolean; // Indicateur de chargement
  error: string | null; // Message d'erreur éventuel
  fetchTournaments: () => Promise<void>; // Fonction pour récupérer les tournois
}

// Création du contexte avec des valeurs par défaut
// Ces valeurs seront remplacées par le Provider
export const TournamentContext = createContext<TournamentContextType>({
  tournaments: [],
  loading: false,
  error: null,
  fetchTournaments: async () => {}, // Fonction vide par défaut
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

  // Rendu du Provider avec les valeurs du contexte
  return (
    <TournamentContext.Provider
      value={{
        tournaments, // Liste des tournois
        loading, // État de chargement
        error, // Message d'erreur éventuel
        fetchTournaments, // Fonction pour récupérer les tournois
      }}
    >
      {children} {/* Rendu des composants enfants */}
    </TournamentContext.Provider>
  );
};