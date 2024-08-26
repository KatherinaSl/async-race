import { buildButton, buildHTMLElement } from "../../utils/create-elements";
import flag from "../../../assets/img/icons8-finish-flag-64.png";
import * as Constants from "../../constants";
import "./tracks.scss";
import { Car } from "../../../data/data";
import createSvgIcon from "../../utils/create-svg";
import { deleteCar, getCars } from "../../services/api-garage";
import { engineDriveMode, engineSetting } from "../../services/api-engine";
import makeCarAnimation from "../../services/car-animation";

export default class TracksGeneration {
  public static animationsMap = new Map();

  public create(car: Car) {
    const tracks = buildHTMLElement("div", "tracks");
    if (car.id) {
      tracks.id = `car-${car.id}`;
    }
    const title = buildHTMLElement("p", "car-name");
    title.textContent = car.name;
    const carItem = buildHTMLElement("div", "car");
    const carImg = buildHTMLElement("div", "car-img");
    carImg.innerHTML += createSvgIcon(car);
    const flagItem = buildHTMLElement("img") as HTMLImageElement;
    flagItem.src = flag as string;
    carItem.append(carImg, flagItem);

    const controleButtons = buildHTMLElement("div", "nav-bar");
    const selectButton = buildButton(Constants.CONROL_BUTTON_SELECT, "button");
    selectButton.addEventListener("click", this.selectButtonHadler);
    const removeButton = buildButton(Constants.CONROL_BUTTON_REMOVE, "reset");
    removeButton.addEventListener("click", this.removeButtonHandler.bind(this));
    const startButton = buildButton(Constants.CONROL_BUTTON_START, "button");
    startButton.addEventListener("click", this.startButtonHandler.bind(this));
    const stopButton = buildButton(Constants.CONROL_BUTTON_STOP, "reset", true);
    stopButton.addEventListener("click", this.stopButtonHandler.bind(this));
    controleButtons.append(selectButton, removeButton, startButton, stopButton);
    tracks.append(title, carItem, controleButtons);
    return tracks;
  }

  private removeButtonHandler(event: Event): void {
    const elementToDelete = (event.target as HTMLElement).closest(".tracks");
    const carId = Number(elementToDelete?.id.replace("car-", ""));
    const currentPage = document
      .querySelector(".pagination .button:last-child")!
      .getAttribute("page");
    deleteCar(carId)
      .then(() => {
        elementToDelete?.remove();
      })
      .then(() => {
        if (currentPage) {
          getCars(Number(currentPage), 7).then((response) => {
            document.querySelectorAll(".tracks").forEach((el) => el.remove());

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
      });
  }

  private selectButtonHadler(event: Event): void {
    const selectedCar = (event.target as HTMLElement).closest(
      ".tracks"
    ) as HTMLElement;

    const carId = Number(selectedCar?.id.replace("car-", ""));
    const form = document.querySelector("#update-form") as HTMLFormElement;
    form.querySelector("button")?.setAttribute("carid", carId.toString());

    form.childNodes.forEach((el) => {
      const child = el;
      if (child instanceof HTMLInputElement) {
        child.disabled = false;
      }
      if (child instanceof HTMLButtonElement) {
        child.disabled = false;
      }
    });

    const carName = selectedCar.querySelector(".car-name")
      ?.textContent as string;

    const carColor = (
      selectedCar.querySelector(`g`) as SVGElement
    ).getAttribute("fill") as string;

    if (carColor.length === 4) {
      const colorArr = carColor.slice(1).split("");
      const newColor = `#${colorArr[0]}${colorArr[0]}${colorArr[1]}${colorArr[1]}${colorArr[2]}${colorArr[2]}`;
      (form.querySelector("input[type=color]") as HTMLInputElement).value =
        newColor;
    } else {
      (form.querySelector("input[type=color]") as HTMLInputElement).value =
        carColor;
    }

    (form.querySelector("input[type=text]") as HTMLInputElement).value =
      carName;
  }

  private startButtonHandler(event: Event) {
    const track = (event.target as HTMLElement).closest(".tracks");
    const button = (event.target as HTMLElement).closest(".button");
    const carId = Number(track?.id.replace("car-", ""));
    (button as HTMLButtonElement).disabled = true;
    (track!.querySelector(".button:last-child") as HTMLButtonElement).disabled =
      false;
    engineSetting(carId, "started")
      .then((response) => {
        const time = Math.round(response.distance / response.velocity);
        return time;
      })
      .then((time) => {
        // todo animation
        const animation = makeCarAnimation(event, time, carId);
        TracksGeneration.animationsMap.set(carId, animation);
        engineDriveMode(carId, "drive").catch(() => {
          console.log("response engine mode");
          engineSetting(carId, "stopped");
          animation.pause();
        });
      });
  }

  private stopButtonHandler(event: Event) {
    const track = (event.target as HTMLElement).closest(".tracks");
    const button = (event.target as HTMLElement).closest(".button");
    const carId = Number(track?.id.replace("car-", ""));

    engineSetting(carId, "stopped").then(() => {
      const animation = TracksGeneration.animationsMap.get(carId);
      animation.cancel();
      (track?.querySelector(".car-img") as HTMLDivElement).style.transform =
        "translateX(0px)";
    });

    console.log("stop handler");
    (button as HTMLButtonElement).disabled = true;
    (
      track?.querySelector(".button:nth-child(3)") as HTMLButtonElement
    ).disabled = false;
  }
}
