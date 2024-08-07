import "./page.scss";
import { buildHTMLElement } from "../../utils/create-elements";
import * as Constants from "../../constants";

export default class WinnersView {
  public create(): HTMLElement {
    const winnersTab = buildHTMLElement("div", "winners-page");

    const pageName = buildHTMLElement("h1", "winners-page__title");
    pageName.textContent = Constants.WINNERS_PAGE_TITLE;

    const pageNumber = buildHTMLElement("p", "winners-page__number");
    pageNumber.textContent = "Page №";

    const ratingTable = this.createRatingRable();

    winnersTab.append(pageName, pageNumber, ratingTable);
    return winnersTab;
  }

  private createRatingRable(): HTMLElement {
    const winners = buildHTMLElement("div", "winners-rating");
    const table = buildHTMLElement("table", "winners-rating__table");
    const thread = buildHTMLElement("thread");

    Constants.TABLE_HEADER.forEach((title) => {
      const th = buildHTMLElement("th");
      th.textContent = title;
      thread.append(th);
    });

    table.append(thread);
    winners.append(table);
    return winners;
  }
}
