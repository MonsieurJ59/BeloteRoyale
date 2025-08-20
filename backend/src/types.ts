export interface Team {
    id: number;
    name: string;
    player1: string;
    player2: string;
    prelim_points: number;
    wins: number;
    losses: number;
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
    prelim_points?: number;
    wins?: number;
    losses?: number;
  }
  
  export interface Match {
    id: number;
    is_prelim: boolean;
    team_a_id: number;
    team_b_id: number;
    score_a: number;
    score_b: number;
    winner_id: number | null;
  }
  
  export interface CreateMatchDto {
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
  