import "./page.scss";
import { buildHTMLElement, buildButton } from "../../utils/create-elements";
import * as Constants from "../../constants";
import { createCar } from "../../services/api-garage";
import TracksGeneration from "../tracks/tracks";

function createButtonHadler() {
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

export default class GarageView {
  public create(): HTMLElement {
    const garageTab = buildHTMLElement("div", "garage-page");

    const pageName = buildHTMLElement("h1", "garage-page__title");
    pageName.textContent = Constants.GARAGE_PAGE_TITLE;

    const pageNumber = buildHTMLElement("p", "garage-page__number");
    pageNumber.textContent = "Page №";

    const operationBar = this.creatOperationBar();
    garageTab.append(pageName, pageNumber, operationBar);

    return garageTab;
  }

  private creatOperationBar(): HTMLElement {
    const div = buildHTMLElement("div", "operations");
    const firstRow = buildHTMLElement("form", "row");
    firstRow.id = "create-form";
    const inputCreate = this.createInput("operations__create", "text");
    const inputColorCreate = this.createInput(
      "operations__create-color",
      "color",
      Constants.BUTTON_PALLET_COLOR,
      false
    );
    const createButton = buildButton(Constants.CRUD_CREATE, "button");
    createButton.addEventListener("click", createButtonHadler);
    firstRow.append(inputCreate, inputColorCreate, createButton);

    const secondRow = buildHTMLElement("form", "row");
    secondRow.id = "update-form";
    const inputUpdate = this.createInput(
      "operations__update",
      "text",
      undefined,
      true
    );
    const inputColorUpdate = this.createInput(
      "operations__create-color",
      "color",
      Constants.BUTTON_PALLET_COLOR,
      true
    );
    const updateButton = buildButton(Constants.CRUD_UPDATE, "submit", true);

    secondRow.append(inputUpdate, inputColorUpdate, updateButton);

    const thirdRow = buildHTMLElement("div", "row");
    const raceButton = buildButton(Constants.CRUD_RACE);
    const resetButton = buildButton(Constants.CRUD_RESET);
    const generateButton = buildButton(Constants.GENERATE_BUTTON);
    thirdRow.append(raceButton, resetButton, generateButton);

    div.append(firstRow, secondRow, thirdRow);
    return div;
  }

  private createInput(
    className: string,
    type: string,
    value?: string,
    disabled?: boolean
  ): HTMLInputElement {
    const input = buildHTMLElement("input") as HTMLInputElement;
    input.classList.add(className);
    input.type = type;
    if (value) {
      input.value = value as string;
    }
    if (disabled) {
      input.disabled = disabled;
    }

    return input;
  }
}
