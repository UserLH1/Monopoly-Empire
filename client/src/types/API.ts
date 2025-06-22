export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface PanelStatus {
  panelId: number;
  purchased: boolean;
  ownerUsername: string | null;
  price: number;
}

export interface TurnData {
  idTurn: number;
  username: string;
  timestamp: string;
  active: boolean;
}

export interface GameData {
  id: number;
  nume: string;
  jucatori: string; // Semicolon-separated list of player names
  dataInceput: string;
  activ: boolean;
}
