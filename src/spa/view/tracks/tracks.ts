import { buildButton, buildHTMLElement } from "../../utils/create-elements";
import flag from "../../../assets/img/icons8-finish-flag-64.png";
import * as Constants from "../../constants";
import "./tracks.scss";
import { Car } from "../../../data/data";
import createSvgIcon from "../../utils/create-svg";

export default class TracksGeneration {
  public create(car: Car) {
    const tracks = buildHTMLElement("div", "tracks");
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
    const removeButton = buildButton(Constants.CONROL_BUTTON_REMOVE);
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
}
