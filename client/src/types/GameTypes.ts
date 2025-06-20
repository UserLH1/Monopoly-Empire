export interface Tile {
  id: string;
  position: number;
  type: TileType;
  name: string;
  color: string | null;
  value: number; // Made non-optional
  logo: string | null;
  valueForTower: number; // Added this property
}

export type TileType =
  | "empire"
  | "chance"
  | "corner"
  | "brand"
  | "utility"
  | "tax";

export interface Brand {
  id: string;
  name: string;
  color: string;
  value: number;
  logo: string;
}

export interface Player {
  id: string;
  name: string;
  money: number;
  properties: Property[];
  brands: Brand[]; // Added brands array
  color: string;
  position: number;
  towerHeight: number; // Added tower height property
}

export interface Property {
  id: string;
  name: string;
  color: string;
  buildings: number;
  mortgaged: boolean;
}
