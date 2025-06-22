// filepath: client/src/types/game.ts

export type TileType =
  | "corner"
  | "brand"
  | "empire"
  | "chance"
  | "tax"
  | "utility";

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

export interface Player {
  id: string;
  name: string;
  color: string;
  money: number;
  position: number;
  properties: Tile[];
  brands: Brand[];
  towerHeight: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  value: number;
  color: string;
}

export interface Card {
  idCard: string;
  cardType: string;
  effectSpecial: string;
  value: number;
}

export interface RentInfo {
  owner: string;
  amount: number;
  property: Tile | null;
}

export interface GameState {
  status: "waiting" | "playing" | "ended";
  currentPlayerIndex: number;
  bankMoney: number;
}
