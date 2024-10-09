export interface Car {
  name: string;
  color: string;
  id?: number;
}

export interface GarageResponse {
  cars: Car[];
  totalCount: number;
}

export interface Winner {
  id: number;
  time: number;
  wins: number;
}

export interface WinnerResponse {
  winners: Winner[];
  totalCount: number;
}

export interface SortSettings {
  sortBy: "time" | "wins";
  order: "ASC" | "DESC";
}
