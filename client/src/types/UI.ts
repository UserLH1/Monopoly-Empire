export type PlayerPanelPosition =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

export interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  duration?: number;
}

export interface RentInfo {
  owner: string;
  amount: number;
  property: import("./GameTypes").Tile | null;
}
