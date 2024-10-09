import { buildButton, buildHTMLElement } from "../../utils/create-elements";
import flag from "../../../assets/img/icons8-finish-flag-64.png";
import * as Constants from "../../constants";
import "./tracks.scss";
import { Car } from "../../../data/data";
import createSvgIcon from "../../utils/create-svg";
import { deleteCar, getCars } from "../../services/api-garage";
import { engineDriveMode, setupEngine } from "../../services/api-engine";
import makeCarAnimation from "../../services/car-animation";
import PaginationView from "../pagination-view/pagination";
import updateColor from "../../utils/update-color";
import { deleteWinner } from "../../services/api-winners";

export default class TracksView extends PaginationView {
  public static animationsMap = new Map();

  private readonly CARS_LIMIT_PER_PAGE = 7;

  private readonly PAGE_SELECTOR = ".tracks";

  public createView(): HTMLElement {
    const pagination = super.createView();
    const tracksView = buildHTMLElement("div", "tracks-view");
    const tracksSlots = buildHTMLElement("div", "tracks-slots");
    this.createTracksView(tracksSlots, pagination).then(() => {
      tracksView.append(tracksSlots, pagination);
    });

    return tracksView;
  }

  protected getPageSelector(): string {
    return this.PAGE_SELECTOR;
  }

  private createTrack(car: Car) {
    const track = buildHTMLElement("div", "tracks");
    if (car.id) {
      track.id = `car-${car.id}`;
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
    selectButton.addEventListener("click", this.selectButtonHadler.bind(this));
    const removeButton = buildButton(Constants.CONROL_BUTTON_REMOVE, "reset");
    removeButton.addEventListener("click", this.removeButtonHandler.bind(this));
    const startButton = buildButton(Constants.CONROL_BUTTON_START, "button");
    startButton.id = "startbutton";
    startButton.addEventListener("click", this.startButtonHandler.bind(this));
    const stopButton = buildButton(Constants.CONROL_BUTTON_STOP, "reset", true);
    stopButton.id = "stopbutton";
    stopButton.addEventListener("click", this.stopButtonHandler.bind(this));
    controleButtons.append(selectButton, removeButton, startButton, stopButton);
    track.append(title, carItem, controleButtons);
    return track;
  }

  public createTracksView(
    tracks?: HTMLElement,
    page?: HTMLElement
  ): Promise<void> {
    const tracksSlots =
      tracks || (document.querySelector(".tracks-slots") as HTMLElement);

    const pagination =
      page || (document.querySelector(".pagination") as HTMLElement);

    return getCars(this.page).then((response) => {
      const numberOfCars = response.totalCount;
      const nextButton = pagination.querySelector(
        "#nextbutton"
      ) as HTMLButtonElement;
      const prevButton = pagination.querySelector(
        "#prevbutton"
      ) as HTMLButtonElement;

      if (this.CARS_LIMIT_PER_PAGE * this.page >= numberOfCars!) {
        nextButton.disabled = true;
      } else {
        nextButton.disabled = false;
      }

      if (this.page > 1) {
        prevButton.disabled = false;
      } else {
        prevButton.disabled = true;
      }

      response.cars.forEach((car) => {
        tracksSlots!.append(this.createTrack(car));
      });

      document.querySelector(".garage-page__title")!.textContent =
        `Garage (${numberOfCars})`;

      document.querySelector(".garage-page__number")!.textContent =
        `Page №${this.page}`;
    });
  }

  private removeButtonHandler(event: Event): void {
    const elementToDelete = (event.target as HTMLElement).closest(".tracks");
    const carId = Number(elementToDelete?.id.replace("car-", ""));

    deleteWinner(carId);
    deleteCar(carId).then(() => {
      this.clearPage();
      this.createTracksView();
    });
  }

  private selectButtonHadler(event: Event): void {
    const selectedCar = (event.target as HTMLElement).closest(
      ".tracks"
    ) as HTMLElement;

    const carId = Number(selectedCar?.id.replace("car-", ""));
    const form = document.querySelector("#update-form") as HTMLFormElement;

    const carName = selectedCar.querySelector(".car-name")
      ?.textContent as string;

    this.enableUpdateForm(form);
    this.fillUpdateForm(selectedCar, form, carId, carName);
  }

  private fillUpdateForm(
    selectedCar: HTMLElement,
    form: HTMLFormElement,
    carId: number,
    carName: string
  ) {
    const carColor = (
      selectedCar.querySelector(`g`) as SVGElement
    ).getAttribute("fill") as string;

    form.querySelector("button")?.setAttribute("carid", carId.toString());
    (form.querySelector("input[type=color]") as HTMLInputElement).value =
      updateColor(carColor);

    (form.querySelector("input[type=text]") as HTMLInputElement).value =
      carName;
  }

  private enableUpdateForm(form: HTMLFormElement) {
    (form.querySelector(".operations__update") as HTMLInputElement).disabled =
      false;
    (
      form.querySelector(".operations__update-color") as HTMLInputElement
    ).disabled = false;
    (form.querySelector(".button") as HTMLButtonElement).disabled = false;
  }

  private startButtonHandler(event: Event) {
    const track = (event.target as HTMLElement).closest(".tracks");
    const button = (event.target as HTMLElement).closest(".button");
    const carId = Number(track?.id.replace("car-", ""));
    (button as HTMLButtonElement).disabled = true;
    (track!.querySelector("#stopbutton") as HTMLButtonElement).disabled = false;
    setupEngine(carId, "started")
      .then((response) => {
        const time = Math.round(response.distance / response.velocity);
        return time;
      })
      .then((time) => {
        const animation = makeCarAnimation(event, time, carId);
        TracksView.animationsMap.set(carId, animation);
        engineDriveMode(carId, "drive").catch(() => {
          setupEngine(carId, "stopped");
          animation.pause();
        });
      });
  }

  private stopButtonHandler(event: Event) {
    const track = (event.target as HTMLElement).closest(".tracks");
    const button = (event.target as HTMLElement).closest(".button");
    const carId = Number(track?.id.replace("car-", ""));

    setupEngine(carId, "stopped").then(() => {
      const animation = TracksView.animationsMap.get(carId);
      animation.cancel();
    });

    (button as HTMLButtonElement).disabled = true;
    (track?.querySelector("#startbutton") as HTMLButtonElement).disabled =
      false;
  }

  protected nextButtonHandler() {
    this.page += 1;
    this.clearPage();
    document
      .querySelector("#nextbutton")!
      .setAttribute("page", this.page.toString());
    (document.querySelector("#racebutton") as HTMLButtonElement).disabled =
      false;
    (document.querySelector("#resetbutton") as HTMLButtonElement).disabled =
      true;

    this.createTracksView();
  }

  protected prevButtonHandler() {
    this.page -= 1;
    this.clearPage();
    this.createTracksView();
  }
}
