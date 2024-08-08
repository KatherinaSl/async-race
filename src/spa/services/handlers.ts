import TracksGeneration from "../view/tracks/tracks";
import { createCar, updateCar } from "./api-garage";

export function createButtonHadler(): void {
  const carName = (
    document.querySelector(".operations__create") as HTMLInputElement
  ).value;

  const carColor = (
    document.querySelector(".operations__create-color") as HTMLInputElement
  ).value;

  if (carName) {
    createCar({ name: carName, color: carColor }).then((car) => {
      const track = new TracksGeneration();
      document.querySelector(".garage-page")!.append(track.create(car));
    });
  }
}

export function updateButtonHandler() {
  const operationBar = document.querySelector(".operations");
  const carId = Number(
    operationBar?.querySelector("#update-form .button")?.getAttribute("carid")
  );
  const updatedCarName = (
    operationBar?.querySelector(".operations__update") as HTMLInputElement
  ).value;

  const updatedCarColor = (
    operationBar?.querySelector(".operations__update-color") as HTMLInputElement
  ).value;

  updateCar({ name: updatedCarName, color: updatedCarColor, id: carId }).then(
    (car) => {
      const carItem = document.querySelector(`#car-${car.id}`)!;
      carItem.querySelector(".car-name")!.textContent = car.name;
      carItem.querySelector("g")?.setAttribute("fill", car.color);
    }
  );
}
