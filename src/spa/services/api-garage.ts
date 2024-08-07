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
    const responseCar = (await response.json()) as Car;
    return responseCar;
  }
  throw new Error("Error while creating the car");
};

export const getCar = async (id: number) => {
  console.log(id);
};
