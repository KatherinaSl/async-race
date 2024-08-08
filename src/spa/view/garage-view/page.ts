import "./page.scss";
import {
  buildHTMLElement,
  buildButton,
  createInput,
} from "../../utils/create-elements";
import * as Constants from "../../constants";
import { getCars } from "../../services/api-garage";
import TracksGeneration from "../tracks/tracks";
import {
  createButtonHadler,
  updateButtonHandler,
} from "../../services/handlers";

export default class GarageView {
  public create(): HTMLElement {
    const garageTab = buildHTMLElement("div", "garage-page");

    const pageName = buildHTMLElement("h1", "garage-page__title");
    pageName.textContent = Constants.GARAGE_PAGE_TITLE;

    const pageNumber = buildHTMLElement("p", "garage-page__number");
    pageNumber.textContent = "Page №";

    const operationBar = this.creatOperationBar();
    garageTab.append(pageName, pageNumber, operationBar);

    getCars(7, 1).then((cars) => {
      const track = new TracksGeneration();
      const garagePage = document.querySelector(".garage-page");
      cars.forEach((car) => {
        garagePage!.append(track.create(car));
      });
    });

    return garageTab;
  }

  private creatOperationBar(): HTMLElement {
    const div = buildHTMLElement("div", "operations");
    const firstRow = buildHTMLElement("form", "row");
    firstRow.id = "create-form";
    const inputCreate = createInput("operations__create", "text");
    const inputColorCreate = createInput(
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
    const inputUpdate = createInput(
      "operations__update",
      "text",
      undefined,
      true
    );
    const inputColorUpdate = createInput(
      "operations__update-color",
      "color",
      Constants.BUTTON_PALLET_COLOR,
      true
    );
    const updateButton = buildButton(Constants.CRUD_UPDATE, "button", true);
    updateButton.addEventListener("click", updateButtonHandler);

    secondRow.append(inputUpdate, inputColorUpdate, updateButton);

    const thirdRow = buildHTMLElement("div", "row");
    const raceButton = buildButton(Constants.CRUD_RACE);
    const resetButton = buildButton(Constants.CRUD_RESET);
    const generateButton = buildButton(Constants.GENERATE_BUTTON);
    thirdRow.append(raceButton, resetButton, generateButton);

    div.append(firstRow, secondRow, thirdRow);
    return div;
  }
}
