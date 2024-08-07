import { buildButton, buildHTMLElement } from "../../../utils/create-elements";
import * as Constants from "../../../constants";

export default class ButtonsNavigation {
  public create() {
    const nav = buildHTMLElement("nav", "navigation");
    const formGarage = buildHTMLElement("form");
    const formWinner = buildHTMLElement("form");

    const buttonGarage = buildButton(Constants.NAV_PAGES.PAGE_GARAGE);
    const buttonWinner = buildButton(Constants.NAV_PAGES.PAGE_WINNERS);

    formGarage.append(buttonGarage);
    formWinner.append(buttonWinner);
    nav.append(formGarage, formWinner);
    return nav;
  }
}
