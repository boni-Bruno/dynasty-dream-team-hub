// Tipos para a API do Sleeper
export interface SleeperLeague {
  league_id: string;
  name: string;
  season: string;
  status: "pre_draft" | "drafting" | "in_season" | "complete";
  sport: string;
  season_type: string;
  total_rosters: number;
  scoring_settings: Record<string, number>;
  roster_positions: string[];
  settings: {
    max_keepers?: number;
    draft_rounds?: number;
    trade_deadline?: number;
    playoff_week_start?: number;
    type?: string;
  };
}

export interface SleeperRoster {
  roster_id: number;
  owner_id: string;
  league_id: string;
  players: string[];
  starters: string[];
  reserve: string[];
  taxi: string[];
  settings: {
    wins: number;
    losses: number;
    ties: number;
    fpts: number;
    fpts_against: number;
  };
}

export interface SleeperPlayer {
  player_id: string;
  first_name: string;
  last_name: string;
  position: string;
  team: string;
  age?: number;
  years_exp?: number;
  injury_status?: string;
  status: "Active" | "Inactive" | "PUP" | "IR";
}

export interface SleeperDraft {
  draft_id: string;
  league_id: string;
  season: string;
  type: "snake" | "linear" | "auction";
  status: "pre_draft" | "drafting" | "complete";
  start_time: number;
  settings: {
    teams: number;
    rounds: number;
    pick_timer: number;
  };
}

export interface SleeperDraftPick {
  pick_no: number;
  round: number;
  roster_id: number;
  player_id: string;
  picked_by: string;
  is_keeper?: boolean;
}

export interface SleeperTrade {
  transaction_id: string;
  type: "trade";
  status: "complete" | "pending";
  roster_ids: number[];
  adds: Record<string, number>;
  drops: Record<string, number>;
  draft_picks: Array<{
    season: string;
    round: number;
    roster_id: number;
    previous_owner_id: number;
    owner_id: number;
  }>;
  created: number;
}

// Estado da aplicação
export interface AppState {
  isConnected: boolean;
  leagueId?: string;
  currentLeague?: SleeperLeague;
  rosters?: SleeperRoster[];
  userRoster?: SleeperRoster;
  players?: Record<string, SleeperPlayer>;
  drafts?: SleeperDraft[];
  trades?: SleeperTrade[];
}