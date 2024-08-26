import "./page.scss";
import {
  buildHTMLElement,
  buildButton,
  createInput,
} from "../../utils/create-elements";
import * as Constants from "../../constants";
import { getCars } from "../../services/api-garage";
import * as Handlers from "../../services/handlers";
import TracksGeneration from "../tracks/tracks";
import PaginationView from "../pagination-view/pagination";

export default class GarageView {
  public create(): HTMLElement {
    const garageTab = buildHTMLElement("div", "garage-page");
    const pageName = buildHTMLElement("h1", "garage-page__title");
    const pageNumber = buildHTMLElement("p", "garage-page__number");

    pageNumber.textContent = `Page №${PaginationView.pageNumber}`;

    const operationBar = this.creatOperationBar();
    garageTab.append(pageName, pageNumber, operationBar);

    getCars(PaginationView.pageNumber).then((response) => {
      const track = new TracksGeneration();
      const garagePage = document.querySelector(".garage-page");
      const numberOfCars = response.totalCount;

      response.cars.forEach((car) => {
        garagePage!.append(track.create(car));
      });

      document.querySelector(".garage-page__title")!.textContent =
        `Garage (${numberOfCars})`;
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
    createButton.addEventListener("click", Handlers.createButtonHadler);
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
    updateButton.addEventListener("click", Handlers.updateButtonHandler);

    secondRow.append(inputUpdate, inputColorUpdate, updateButton);

    const thirdRow = buildHTMLElement("div", "row");
    const raceButton = buildButton(Constants.CRUD_RACE);
    raceButton.id = "racebutton";
    raceButton.addEventListener("click", Handlers.raceButtonHandler.bind(this));
    const resetButton = buildButton(Constants.CRUD_RESET, "reset", true);
    resetButton.id = "resetbutton";
    resetButton.addEventListener("click", Handlers.resetButtonHandler);
    const generateButton = buildButton(Constants.GENERATE_BUTTON);
    generateButton.addEventListener("click", Handlers.generateButtonHandler);
    thirdRow.append(raceButton, resetButton, generateButton);

    div.append(firstRow, secondRow, thirdRow);
    return div;
  }
}
