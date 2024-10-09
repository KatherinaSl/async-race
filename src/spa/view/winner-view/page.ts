import "./page.scss";
import { buildHTMLElement } from "../../utils/create-elements";
import WinnersTable from "../winners-table/winners-table";

export default class WinnersView {
  public create(): HTMLElement {
    const winnersTab = buildHTMLElement("div", "winners-page");
    const pageName = buildHTMLElement("h1", "winners-page__title");
    const pageNumber = buildHTMLElement("p", "winners-page__number");
    const ratingTable = new WinnersTable();

    winnersTab.append(pageName, pageNumber, ratingTable.createView());
    return winnersTab;
  }
}
