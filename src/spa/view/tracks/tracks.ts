import { buildButton, buildHTMLElement } from "../../utils/create-elements";
import flag from "../../../assets/img/icons8-finish-flag-64.png";
import * as Constants from "../../constants";
import "./tracks.scss";
import { Car } from "../../../data/data";
import createSvgIcon from "../../utils/create-svg";
import { deleteCar } from "../../services/api-garage";

export default class TracksGeneration {
  public create(car: Car) {
    const tracks = buildHTMLElement("div", "tracks");
    if (car.id) {
      tracks.id = `car-${car.id}`;
    }
    const title = buildHTMLElement("p", "car-name");
    title.textContent = car.name;
    const carItem = buildHTMLElement("div", "car");

    carItem.innerHTML += createSvgIcon(car);
    const flagItem = buildHTMLElement("img") as HTMLImageElement;
    flagItem.src = flag as string;
    carItem.append(flagItem);

    const underline = buildHTMLElement("div", "underline");

    const controleButtons = buildHTMLElement("div", "nav-bar");
    const selectButton = buildButton(Constants.CONROL_BUTTON_SELECT);
    selectButton.addEventListener("click", this.selectButtonHadler);
    const removeButton = buildButton(Constants.CONROL_BUTTON_REMOVE);
    removeButton.addEventListener("click", this.removeButtonHandler);
    const startButton = buildButton(Constants.CONROL_BUTTON_START);
    const stopButton = buildButton(
      Constants.CONROL_BUTTON_STOP,
      undefined,
      true
    );
    controleButtons.append(selectButton, removeButton, startButton, stopButton);
    tracks.append(title, carItem, underline, controleButtons);
    return tracks;
  }

  private removeButtonHandler(event: Event): void {
    const elementToDelete = (event.target as HTMLElement).closest(".tracks");
    const carId = Number(elementToDelete?.id.replace("car-", ""));
    deleteCar(carId).then(() => {
      elementToDelete?.remove();
    });
  }

  private selectButtonHadler(event: Event): void {
    const selectedCar = (event.target as HTMLElement).closest(
      ".tracks"
    ) as HTMLElement;

    const carId = Number(selectedCar?.id.replace("car-", ""));
    document
      .querySelector("#update-form button")
      ?.setAttribute("carid", carId.toString());
    const form = document.querySelector("#update-form") as HTMLFormElement;

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
    (document.querySelector(".operations__update") as HTMLInputElement).value =
      carName;

    (
      document.querySelector(".operations__update-color") as HTMLInputElement
    ).value = carColor;
  }
}
