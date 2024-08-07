// import { buildButton } from "../../utils/create-elements";
import "./header.scss";
import * as Constants from "../../constants";
import ButtonsNavigation from "./link/link";
import { buildHTMLElement } from "../../utils/create-elements";

export default class HeaderView {
  public create(): HTMLElement {
    const header = buildHTMLElement("header", "header");
    // const nav = this.createHTMLElement("nav", "navigation");
    // const buttonGarage = buildButton(Constants.NAV_TO_GARAGE);
    // const buttonWinner = buildButton(Constants.NAV_TO_WINNERS);
    const nav = new ButtonsNavigation();
    const logo = buildHTMLElement("div", "logo");
    const title = buildHTMLElement("p");
    title.textContent = Constants.APP_TITLE;
    // nav.append(buttonGarage, buttonWinner);
    logo.append(title);
    header.append(nav.create(), logo);
    return header;
  }
}
