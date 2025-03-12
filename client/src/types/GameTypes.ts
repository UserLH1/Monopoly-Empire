export interface Tile {
  id: string;
  position: number;
  name: string;
  type: "property" | "chance" | "community" | "tax" | "corner";
  color?: string;
  price?: number;
}

export interface Player {
  id: string;
  name: string;
  money: number;
  properties: Property[];
  color: string;
  position: number;
}

export interface Property {
  id: string;
  name: string;
  color: string;
  buildings: number;
  mortgaged: boolean;
}
