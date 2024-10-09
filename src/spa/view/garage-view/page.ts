import "./page.scss";
import {
  buildHTMLElement,
  buildButton,
  createInput,
} from "../../utils/create-elements";
import * as Constants from "../../constants";
import TracksView from "../tracks/tracks";
import Handlers from "../../services/handlers";

export default class GarageView {
  private handlers: Handlers;

  private tracks: TracksView;

  constructor() {
    this.handlers = new Handlers();
    this.tracks = new TracksView();
  }

  public create(): HTMLElement {
    const garageTab = buildHTMLElement("div", "garage-page");
    const pageName = buildHTMLElement("h1", "garage-page__title");
    const pageNumber = buildHTMLElement("p", "garage-page__number");
    garageTab.append(
      pageName,
      pageNumber,
      this.creatOperationBar(),
      this.tracks.createView()
    );
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
    createButton.addEventListener("click", () => {
      this.handlers.createButtonHadler(this.tracks);
    });
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
    updateButton.addEventListener(
      "click",
      Handlers.updateButtonHandler.bind(this)
    );

    secondRow.append(inputUpdate, inputColorUpdate, updateButton);

    const thirdRow = buildHTMLElement("div", "row");
    const raceButton = buildButton(Constants.CRUD_RACE);
    raceButton.id = "racebutton";
    raceButton.addEventListener("click", Handlers.raceButtonHandler.bind(this));
    const resetButton = buildButton(Constants.CRUD_RESET, "reset", true);
    resetButton.id = "resetbutton";
    resetButton.addEventListener("click", this.handlers.resetButtonHandler);
    const generateButton = buildButton(Constants.GENERATE_BUTTON);
    generateButton.addEventListener("click", () => {
      this.handlers.generateButtonHandler(this.tracks);
    });
    thirdRow.append(raceButton, resetButton, generateButton);

    div.append(firstRow, secondRow, thirdRow);
    return div;
  }
}
