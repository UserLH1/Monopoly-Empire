// În types/Card.ts
export type CardType = "empire" | "chance";
export type CardEffect =
  | "MOVE_FORWARD"
  | "COLLECT_MONEY"
  | "PAY_MONEY"
  | "GO_TO_JAIL"
  | "GET_OUT_JAIL"
  | "PROPERTYVALUE_BOOST"
  | "MOVE"
  | "SWAP_BRAND"
  | "STEAL_BRAND"
  | "RETURN_BRAND"
  | "SPECIAL_EFFECT";

export interface Card {
  idCard: number; // Modificat din id în idCard
  titlu: string;
  descriere: string;
  cardType: CardType;
  valoare: number | null;
  efectSpecial: CardEffect | null;
  imagine: string | null;
}

export interface ActiveCard extends Card {
  idCardActiv: number;
  username: string;
  folosit: boolean;
  dataObtinere: string;
}
