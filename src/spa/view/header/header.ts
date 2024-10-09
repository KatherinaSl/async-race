import "./header.scss";
import * as Constants from "../../constants";
import { buildButton, buildHTMLElement } from "../../utils/create-elements";

export default class HeaderView {
  public create(): HTMLElement {
    const header = buildHTMLElement("header", "header");
    const nav = buildHTMLElement("nav", "navigation");
    const buttonGarage = buildButton(
      Constants.NAV_PAGES.PAGE_GARAGE,
      "button",
      true
    );
    buttonGarage.id = "garagebutton";
    const buttonWinner = buildButton(Constants.NAV_PAGES.PAGE_WINNERS);
    buttonWinner.id = "winnerbutton";
    const logo = buildHTMLElement("div", "logo");
    const title = buildHTMLElement("p");
    title.textContent = Constants.APP_TITLE;
    nav.append(buttonGarage, buttonWinner);
    logo.append(title);
    header.append(nav, logo);
    return header;
  }
}
