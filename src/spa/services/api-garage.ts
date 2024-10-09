import { Car, GarageResponse } from "../../data/data";

export const createCar = async (car: Car): Promise<Car> => {
  const url = "http://127.0.0.1:3000/garage";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(car),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const responseCar = response.json();
    return responseCar;
  }
  throw new Error("Error while creating the car");
};

export const getCars = async (
  pageNumber = 1,
  carLimit = 7
): Promise<GarageResponse> => {
  const url = `http://127.0.0.1:3000/garage?_limit=${carLimit}&_page=${pageNumber}`;
  const response = await fetch(url);

  if (response.ok) {
    const allCars = await response.json();
    const totalCarsHeader = response.headers.get("X-Total-Count");

    return { cars: allCars, totalCount: Number(totalCarsHeader) };
  }
  throw new Error("Error while getting cars");
};

export const getCar = async (id: number): Promise<Car> => {
  const url = `http://127.0.0.1:3000/garage/${id}`;
  const response = await fetch(url, {
    method: "GET",
  });

  if (response.ok) {
    const car = response.json();
    return car;
  }

  throw new Error("Error while getting car");
};

export const deleteCar = async (id: number): Promise<void> => {
  const url = `http://127.0.0.1:3000/garage/${id}`;
  const response = await fetch(url, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Error while deleting the car");
  }
};

export const updateCar = async (car: Car): Promise<Car> => {
  const url = `http://127.0.0.1:3000/garage/${car.id}`;
  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(car),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const updatedCar = response.json();
    return updatedCar;
  }

  throw new Error("Erro while updating car");
};
