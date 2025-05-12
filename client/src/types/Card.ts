// În types/Card.ts
export type CardType = "empire" | "chance";

export interface Card {
  idCard: number;  // Modificat din id în idCard
  descriere: string;
  cardType: string; // Modificat din tip în cardType
  nume?: string; // Opțional acum
  valoare?: number;
  efectSpecial?: string;
  imagineUrl?: string;
}

export interface ActiveCard extends Card {
  idCardActiv: number;
  username: string;
  idJoc: number;
  folosit: boolean;
}