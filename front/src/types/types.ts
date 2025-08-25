// Définition des modèles / interfaces TypeScript

// Définition des interfaces TypeScript pour l'application
// Ces interfaces définissent la structure des données manipulées

/**
 * Interface représentant une équipe
 * Une équipe est composée de deux joueurs et participe aux tournois
 */
export interface Team {
  id: number;           // Identifiant unique de l'équipe
  name: string;         // Nom de l'équipe
  player1: string;      // Nom du premier joueur
  player2: string;      // Nom du deuxième joueur
  created_at: Date;     // Date de création de l'équipe
}

/**
 * Interface représentant un match
 * Un match oppose deux équipes dans le cadre d'un tournoi
 */
export interface Match {
  id: number;           // Identifiant unique du match
  tournament_id: number; // Identifiant du tournoi auquel appartient le match
  team_a_id: number;    // Identifiant de la première équipe
  team_b_id: number;    // Identifiant de la deuxième équipe
  score_a: number;      // Score de la première équipe
  score_b: number;      // Score de la deuxième équipe
  winner_id: number | null; // Identifiant de l'équipe gagnante (null si match nul ou non terminé)
  is_prelim: boolean;   // Indique si c'est un match préliminaire (true) ou principal (false)
  created_at: Date;     // Date de création du match
}

/**
 * Interface représentant un tournoi
 * Un tournoi regroupe plusieurs matchs entre différentes équipes
 */
export interface Tournament {
  id: number;           // Identifiant unique du tournoi
  name: string;         // Nom du tournoi
  date: Date;           // Date du tournoi
  status: 'upcoming' | 'in_progress' | 'completed'; // Statut du tournoi (à venir, en cours, terminé)
  created_at: Date;     // Date de création du tournoi dans le système
}

/**
 * Interface représentant les statistiques d'une équipe dans un tournoi
 * Permet de suivre les performances des équipes et d'établir un classement
 */
export interface TeamTournamentStats {
  id: number;           // Identifiant unique des statistiques
  team_id: number;      // Identifiant de l'équipe concernée
  tournament_id: number; // Identifiant du tournoi concerné
  prelim_points: number; // Points accumulés lors des matchs préliminaires
  wins: number;         // Nombre de victoires
  losses: number;       // Nombre de défaites
}