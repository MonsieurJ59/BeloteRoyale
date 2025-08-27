// ----------------------
// Types génériques matchs
// ----------------------

// Un match est soit "preliminaires", soit "principal_X" avec X = 1, 2, 3, ...
export type MatchType = 'preliminaires' | `principal_${number}`;

// ----------------------
// Config des types de matchs
// ----------------------

export interface TournamentMatchConfig {
  id: number;
  tournament_id: number;
  match_type: MatchType;   // "preliminaires" ou "principal_X"
  is_enabled: boolean;
  max_matches?: number;    // Nombre max de matchs de ce type
}

export interface CreateTournamentMatchConfigDto {
  tournament_id: number;
  match_type: MatchType;
  is_enabled: boolean;
  max_matches?: number;
}

// ----------------------
// Teams
// ----------------------

export interface Team {
  id: number;
  name: string;
  player1: string;
  player2: string;
}

export interface CreateTeamDto {
  name: string;
  player1: string;
  player2: string;
}

export interface UpdateTeamDto {
  name?: string;
  player1?: string;
  player2?: string;
}

// ----------------------
// Matches
// ----------------------

export interface Match {
  id: number;
  tournament_id: number;
  match_type: MatchType;
  team_a_id: number;
  team_b_id: number;
  score_a: number;
  score_b: number;
  winner_id: number | null;
  match_order?: number; // pour ordonner les matchs
}

export interface CreateMatchDto {
  tournament_id: number;
  match_type: MatchType;
  team_a_id: number;
  team_b_id: number;
  score_a?: number;
  score_b?: number;
  winner_id?: number | null;
  match_order?: number;
}

export interface UpdateMatchDto {
  match_type?: MatchType;
  score_a?: number;
  score_b?: number;
  winner_id?: number | null;
  match_order?: number;
}

// ----------------------
// Tournaments
// ----------------------

export interface Tournament {
  id: number;
  name: string;
  date: Date;
  status: 'upcoming' | 'in_progress' | 'completed';
  created_at: Date;
  match_configs?: TournamentMatchConfig[];
}

export interface CreateTournamentDto {
  name: string;
  date: Date;
  status?: 'upcoming' | 'in_progress' | 'completed';
  match_configs?: CreateTournamentMatchConfigDto[];
}

export interface UpdateTournamentDto {
  name?: string;
  date?: Date;
  status?: 'upcoming' | 'in_progress' | 'completed';
}

// ----------------------
// Stats par tournoi
// ----------------------

export interface TeamTournamentStats {
  id: number;
  team_id: number;
  tournament_id: number;
  prelim_points: number;
  wins: number;
  losses: number;
}

export interface CreateTeamTournamentStatsDto {
  team_id: number;
  tournament_id: number;
  prelim_points?: number;
  wins?: number;
  losses?: number;
}

export interface UpdateTeamTournamentStatsDto {
  prelim_points?: number;
  wins?: number;
  losses?: number;
}

// ----------------------
// Association équipes-tournois
// ----------------------

export interface TeamTournament {
  id: number;
  team_id: number;
  tournament_id: number;
  registration_date: Date;
}

export interface CreateTeamTournamentDto {
  team_id: number;
  tournament_id: number;
}

// ----------------------
// Étendus
// ----------------------

export interface TournamentWithMatches extends Tournament {
  matches: Match[];
}

export interface TournamentWithConfig extends Tournament {
  match_configs: TournamentMatchConfig[];
  matches: Match[];
}

export interface TeamWithTournaments extends Team {
  tournaments: Tournament[];
}

// ----------------------
// Validation
// ----------------------

export interface TournamentValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Contraintes par défaut : toujours 1 préliminaires + au moins 1 principal_1
export const DEFAULT_TOURNAMENT_CONFIG: CreateTournamentMatchConfigDto[] = [
  { tournament_id: 0, match_type: 'preliminaires', is_enabled: true, max_matches: 10 },
  { tournament_id: 0, match_type: 'principal_1', is_enabled: true, max_matches: 5 }
];

// Validation d’un tournoi
export function validateTournamentConfig(configs: TournamentMatchConfig[]): TournamentValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Vérifier qu'il y a au moins un match préliminaire
  const prelim = configs.find(c => c.match_type === 'preliminaires' && c.is_enabled);
  if (!prelim) {
    errors.push('Un tournoi doit avoir au moins un type de match "préliminaires" activé');
  }

  // Vérifier qu'il y a au moins un principal
  const principal = configs.find(c => c.match_type.startsWith('principal_') && c.is_enabled);
  if (!principal) {
    errors.push('Un tournoi doit avoir au moins une phase principale (principal_1)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
