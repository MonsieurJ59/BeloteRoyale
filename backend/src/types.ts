export interface Team {
  id: number;
  name: string;
  prelim_points: number;
  wins: number;
  losses: number;
}

export interface Player {
  id: number;
  name: string;
  team_id: number;
}

export interface Match {
  id: number;
  round: 'preliminaire' | 'principal';
  team_a_id: number;
  team_b_id: number;
  score_a: number;
  score_b: number;
  winner_id: number | null;
}

export interface CreateTeamDto {
  name: string;
  players?: string[];
}

export interface UpdateTeamDto {
  name?: string;
  prelim_points?: number;
  wins?: number;
  losses?: number;
}

export interface CreateMatchDto {
  round: 'preliminaire' | 'principal';
  team_a_id: number;
  team_b_id: number;
  score_a?: number;
  score_b?: number;
  winner_id?: number | null;
}

export interface UpdateMatchDto {
  score_a?: number;
  score_b?: number;
  winner_id?: number | null;
}