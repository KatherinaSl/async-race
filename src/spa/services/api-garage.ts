import { Car } from "../../data/data";
// import TracksGeneration from "../view/tracks/tracks";

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
  carLimit: number,
  pageLimit: number
): Promise<Car[]> => {
  const url = `http://127.0.0.1:3000/garage?_limit=${carLimit}&_page=${pageLimit}`;
  const response = await fetch(url);
  if (response.ok) {
    const allCars = response.json();
    return allCars;
  }
  throw new Error("Error while getting cars");
};

export const deleteCar = async (id: number): Promise<void> => {
  console.log(id);
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

// todo check if correct
// export const getCar = (id: number): Promise<Car> => {
//   const url = `http://127.0.0.1:3000/garage/${id}`;
//   return fetch(url).then((response) => {
//     if (response.ok) {
//       return response.json();
//     }
//     throw new Error(`id: ${id}, status: ${response.status}`);
//   });
// };
