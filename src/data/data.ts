export interface Car {
  name: string;
  color: string;
  id?: number;
}

export interface GarageResponse {
  cars: Car[];
  totalCount?: number;
}

export interface Winner {
  carid: number;
  carTime: number;
  carName?: string;
}
