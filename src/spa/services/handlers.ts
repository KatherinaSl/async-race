import getRandomCar from "../../data/randomCars";
import TracksGeneration from "../view/tracks/tracks";
import { createCar, getCars, updateCar } from "./api-garage";
import * as Constants from "../constants";
import PaginationView from "../view/pagination-view/pagination";
import { engineDriveMode, engineSetting } from "./api-engine";
import makeCarAnimation from "./car-animation";
import { Winner } from "../../data/data";
import { createWinnerMessage } from "../utils/create-elements";

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

  getCars().then((response) => {
    const track = new TracksGeneration();
    const garagePage = document.querySelector(".garage-page");
    const numberOfCars = response.totalCount;

    response.cars.forEach((car) => {
      garagePage!.append(track.create(car));
    });

    document.querySelector(".garage-page__title")!.textContent =
      `Garage (${numberOfCars})`;
  });
}

export function updateButtonHandler() {
  const operationBar = document.querySelector(".operations");
  const form = document.querySelector("#update-form") as HTMLFormElement;
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

  form.childNodes.forEach((el) => {
    const child = el;
    if (child instanceof HTMLInputElement) {
      if (child.type === "text") {
        child.value = "";
      } else {
        child.value = Constants.BUTTON_PALLET_COLOR;
      }

      child.disabled = true;
    }
    if (child instanceof HTMLButtonElement) {
      child.disabled = true;
    }
  });
}

export function generateButtonHandler() {
  const cars = getRandomCar();

  Promise.allSettled(cars.map((car) => createCar(car))).then(() => {
    getCars().then((response) => {
      document.querySelectorAll(".tracks").forEach((el) => el.remove());

      const track = new TracksGeneration();
      const garagePage = document.querySelector(".garage-page");
      response.cars.forEach((car) => {
        garagePage!.append(track.create(car));
      });

      const numberOfCars = response.totalCount;
      document.querySelector(".garage-page__title")!.textContent =
        `Garage (${numberOfCars})`;
    });
  });
}

export function raceButtonHandler(event: Event) {
  let winner: Winner;
  // const velocityCollection = new Map();
  const buttonRow = (event.target as HTMLElement).closest(".row");
  (document.querySelector("#racebutton") as HTMLButtonElement).disabled = true;
  (
    buttonRow?.querySelector("button[type=reset]") as HTMLButtonElement
  ).disabled = false;

  getCars(PaginationView.pageNumber).then((response) => {
    const allCars = response.cars;
    allCars.forEach((car) => {
      engineSetting(Number(car.id), "started")
        .then((res) => {
          const time = Math.round(res.distance / res.velocity);
          // velocityCollection.set(Number(car.id), time);
          return time;
        })
        .then((time) => {
          const animation = makeCarAnimation(
            event,
            time,
            Number(car.id),
            (carId) => {
              if (!winner) {
                winner = { carid: carId, carTime: time, carName: car.name };
                const winnerPhrase = `winner ${car.name}. Time: ${carId} ms`;
                console.log(winnerPhrase);
                createWinnerMessage(winnerPhrase);
              }
            }
          );
          TracksGeneration.animationsMap.set(Number(car.id), animation);
          engineDriveMode(Number(car.id), "drive").catch(() => {
            engineSetting(Number(car.id), "stopped");
            animation.pause();
          });
        });
    });

    // const bestTime = velocityCollection[0].

    // console.log(velocityCollection);

    // Promise.race(allCars).then((responseCar) => console.log(responseCar.name));
  });

  // Promise.race()
}

export function resetButtonHandler(event: Event) {
  const button = (event.target as HTMLElement).closest(
    ".button"
  ) as HTMLButtonElement;
  const allCarsElements = document.querySelectorAll(".car-img");

  getCars(PaginationView.pageNumber).then((response) => {
    const allCars = response.cars;
    console.log(allCars);

    allCars.forEach((car) => {
      engineSetting(Number(car.id), "stopped").then(() => {
        const animation = TracksGeneration.animationsMap.get(Number(car.id));
        animation.cancel();

        allCarsElements.forEach((element) => {
          const carEl = element;
          (carEl as HTMLDivElement).style.transform = "translateX(0px)";
        });
      });
    });
  });
  button.disabled = true;
}
