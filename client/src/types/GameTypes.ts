export type TileType =
  | "empire"
  | "chance"
  | "corner"
  | "brand"
  | "utility"
  | "tax";

export interface Tile {
  id: string;
  position: number;
  type: TileType;
  name: string;
  color: string | null;
  value: number;
  logo: string | null;
  valueForTower: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  value: number;
  color: string;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  money: number;
  position: number;
  properties: any[]; // You can define a Property interface if needed
  brands: Brand[];
  towerHeight: number;
}

export interface GameState {
  id: number;
  status: "waiting" | "playing" | "finished";
  players: Player[];
  currentPlayerIndex: number;
  bankMoney: number;
  gameTime: number | null;
}

export interface Property {
  id: string;
  name: string;
  color: string;
  buildings: number;
  mortgaged: boolean;
}
