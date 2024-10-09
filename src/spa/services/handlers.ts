import { createCar, getCars, updateCar } from "./api-garage";
import TracksView from "../view/tracks/tracks";
import getRandomCar from "../../data/randomCars";
import { createWinnerMessage } from "../utils/create-elements";
import { createWinner, getWinner, updateWinner } from "./api-winners";
import { Car, Winner } from "../../data/data";
import { engineDriveMode, setupEngine } from "./api-engine";
import makeCarAnimation from "./car-animation";
import { BUTTON_PALLET_COLOR } from "../constants";

export default class OperationHandlers {
  public createButtonHadler(track: TracksView): void {
    const carName = (
      document.querySelector(".operations__create") as HTMLInputElement
    ).value;

    const carColor = (
      document.querySelector(".operations__create-color") as HTMLInputElement
    ).value;

    if (carName) {
      createCar({ name: carName, color: carColor }).then(() => {
        track.clearPage();
        track.createTracksView();
      });
    }
  }

  static updateButtonHandler() {
    const operationBar = document.querySelector(".operations");
    const form = document.querySelector("#update-form") as HTMLFormElement;
    const carId = Number(
      operationBar?.querySelector("#update-form .button")?.getAttribute("carid")
    );
    const updatedCarName = (
      operationBar?.querySelector(".operations__update") as HTMLInputElement
    ).value;

    const updatedCarColor = (
      operationBar?.querySelector(
        ".operations__update-color"
      ) as HTMLInputElement
    ).value;

    updateCar({ name: updatedCarName, color: updatedCarColor, id: carId }).then(
      (car) => {
        const carItem = document.querySelector(`#car-${car.id}`)!;
        carItem.querySelector(".car-name")!.textContent = car.name;
        carItem.querySelector("g")?.setAttribute("fill", car.color);
      }
    );

    OperationHandlers.prototype.disableUpdateInput(form);
  }

  private disableUpdateInput(form: HTMLFormElement) {
    form.childNodes.forEach((el) => {
      const child = el;
      if (child instanceof HTMLInputElement) {
        if (child.type === "text") {
          child.value = "";
        } else {
          child.value = BUTTON_PALLET_COLOR;
        }

        child.disabled = true;
      }
      if (child instanceof HTMLButtonElement) {
        child.disabled = true;
      }
    });
  }

  public generateButtonHandler(track: TracksView) {
    const cars = getRandomCar();

    Promise.allSettled(cars.map((car) => createCar(car))).then(() => {
      track.clearPage();
      track.createTracksView();
    });
  }

  public setWinner(carTime: number, car: Car): Winner {
    const winner = {
      id: car.id!,
      time: carTime,
      wins: 1,
    };
    const winnerPhrase = `Winner: ${car.name}, time: ${carTime} ms`;

    createWinnerMessage(winnerPhrase);

    getWinner(winner.id)
      .then(() => {
        winner.wins += 1;
        updateWinner(winner);
      })
      .catch(() => {
        createWinner(winner);
      });

    return winner;
  }

  static raceButtonHandler(event: Event) {
    let winner: Winner;
    const page = Number(
      document.querySelector("#nextbutton")?.getAttribute("page")
    );
    (document.querySelector("#racebutton") as HTMLButtonElement).disabled =
      true;
    (document.querySelector("#resetbutton") as HTMLButtonElement).disabled =
      false;

    getCars(page).then((response) => {
      const allCars = response.cars;
      allCars.forEach((car) => {
        setupEngine(Number(car.id), "started").then((res) => {
          const time = Math.round(res.distance / res.velocity);
          const carTime = time;
          const animation = makeCarAnimation(
            event,
            carTime,
            Number(car.id),
            () => {
              if (!winner) {
                winner = OperationHandlers.prototype.setWinner(carTime, car);
              }
            }
          );
          TracksView.animationsMap.set(Number(car.id), animation);
          engineDriveMode(Number(car.id), "drive").catch(() => {
            setupEngine(Number(car.id), "stopped");
            animation.pause();
          });
        });
      });
    });
  }

  public resetButtonHandler() {
    const page = Number(
      document.querySelector("#nextbutton")?.getAttribute("page")
    );

    getCars(page).then((response) => {
      const allCars = response.cars;

      allCars.forEach((car) => {
        setupEngine(Number(car.id), "stopped").then(() => {
          const animation = TracksView.animationsMap.get(Number(car.id));
          animation.cancel();
        });
      });
    });
  }
}
