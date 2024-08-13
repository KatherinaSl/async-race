export interface Car {
  name: string;
  color: string;
  id?: number;
}

export interface GarageResponse {
  cars: Car[];
  totalCount?: number;
}
