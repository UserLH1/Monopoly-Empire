export interface Tile {
  id: string;
  position: number;
  name: string;
  type: "property" | "chance" | "community" | "tax" | "corner" | "empire" | "brand" | "utility";
  color?: string;
  price?: number;
  value?: number;
  logo?: string;
}

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
  brands: Brand[];  // Added brands array
  color: string;
  position: number;
  towerHeight: number;  // Added tower height property
}

export interface Property {
  id: string;
  name: string;
  color: string;
  buildings: number;
  mortgaged: boolean;
}
