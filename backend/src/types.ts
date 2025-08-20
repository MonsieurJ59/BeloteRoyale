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
  
  export interface Match {
    id: number;
    tournament_id: number;
    is_prelim: boolean;
    team_a_id: number;
    team_b_id: number;
    score_a: number;
    score_b: number;
    winner_id: number | null;
  }
  
  export interface CreateMatchDto {
    tournament_id: number;
    is_prelim: boolean;
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
  
export interface Tournament {
    id: number;
    name: string;
    date: Date;
    status: 'upcoming' | 'in_progress' | 'completed';
    created_at: Date;
  }
  
export interface CreateTournamentDto {
    name: string;
    date: Date;
    status?: 'upcoming' | 'in_progress' | 'completed';
  }
  
export interface UpdateTournamentDto {
    name?: string;
    date?: Date;
    status?: 'upcoming' | 'in_progress' | 'completed';
  }
  
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
  