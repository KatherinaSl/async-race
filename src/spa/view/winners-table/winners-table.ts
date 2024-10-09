import { buildHTMLElement } from "../../utils/create-elements";
import * as Constants from "../../constants";
import { getWinners } from "../../services/api-winners";
import { getCar } from "../../services/api-garage";
import createSvgIcon from "../../utils/create-svg";
import PaginationView from "../pagination-view/pagination";
import { SortSettings, WinnerResponse } from "../../../data/data";

export default class WinnersTable extends PaginationView {
  private readonly WINNERS_LIMIT = 10;

  private readonly PAGE_SELECTOR = "tr";

  private sortSettings: SortSettings = {
    sortBy: "time",
    order: "ASC",
  };

  protected getPageSelector(): string {
    return this.PAGE_SELECTOR;
  }

  public createView(): HTMLElement {
    const pagination = super.createView();
    const winners = buildHTMLElement("div", "winners-rating");
    const table = buildHTMLElement("table", "winners-rating__table");
    const thread = buildHTMLElement("thead");

    Constants.TABLE_HEADER.forEach((title) => {
      const th = buildHTMLElement("th");
      th.textContent = title;
      if (title === "Wins") {
        th.id = "wins";
        th.addEventListener("click", () => {
          const tbody = document.querySelector("tbody") as HTMLElement;
          this.clearPage();
          this.buildRows(this.page, tbody, "wins");
        });
      }
      if (title === "Time") {
        th.id = "time";
        th.addEventListener("click", () => {
          const tbody = document.querySelector("tbody") as HTMLElement;
          this.clearPage();
          this.buildRows(this.page, tbody, "time");
        });
      }
      thread.append(th);
    });

    table.append(thread, this.createTableRows());
    winners.append(table, pagination);
    return winners;
  }

  protected nextButtonHandler() {
    const tbody = document.querySelector("tbody") as HTMLElement;
    this.page += 1;
    this.clearPage();
    this.buildRows(this.page, tbody);
  }

  protected prevButtonHandler() {
    const tbody = document.querySelector("tbody") as HTMLElement;
    this.page -= 1;
    this.clearPage();
    this.buildRows(this.page, tbody);
  }

  private createTableRows(): HTMLElement {
    const tbody = buildHTMLElement("tbody");

    this.buildRows(this.page, tbody);

    return tbody;
  }

  private buildRows(page: number, tbody: HTMLElement, sort?: "wins" | "time") {
    if (sort) {
      this.updateSortSettings(sort);
    }

    getWinners(
      page,
      this.WINNERS_LIMIT,
      this.sortSettings.sortBy,
      this.sortSettings.order
    ).then((response) => {
      const numberOfWinners = response.totalCount as number;
      const nextButton = document.querySelector(
        ".winners-page #nextbutton"
      ) as HTMLButtonElement;
      const prevButton = document.querySelector(
        ".winners-page #prevbutton"
      ) as HTMLButtonElement;

      if (this.WINNERS_LIMIT * this.page >= numberOfWinners!) {
        nextButton.disabled = true;
      } else {
        nextButton.disabled = false;
      }

      if (this.page > 1) {
        prevButton.disabled = false;
      } else {
        prevButton.disabled = true;
      }

      document.querySelector(".winners-page__title")!.textContent =
        `Winners (${numberOfWinners})`;

      document.querySelector(".winners-page__number")!.textContent =
        `Page №${this.page}`;

      this.generateRows(response, tbody);
    });
  }

  private updateSortSettings(sort: "time" | "wins") {
    if (sort === this.sortSettings.sortBy) {
      this.sortSettings.order =
        this.sortSettings.order === "ASC" ? "DESC" : "ASC";
    } else {
      this.sortSettings.sortBy = sort;
      this.sortSettings.order = "ASC";
    }
  }

  private generateRows(response: WinnerResponse, tbody: HTMLElement) {
    let position = 0;
    response.winners.forEach((winnerInfo) => {
      const tr = buildHTMLElement("tr");
      const td1 = buildHTMLElement("td");
      const td2 = buildHTMLElement("td");
      const td3 = buildHTMLElement("td");
      const td4 = buildHTMLElement("td");
      const td5 = buildHTMLElement("td");

      position += 1;
      td1.textContent = `${position}`;
      getCar(winnerInfo.id)
        .then((car) => {
          td3.textContent = `${car.name}`;
          return car;
        })
        .then((car) => {
          td2.innerHTML += createSvgIcon(car);
        });

      td4.textContent = `${winnerInfo.wins}`;
      td5.textContent = `${(winnerInfo.time / 1000).toFixed(1)}`;
      tr.append(td1, td2, td3, td4, td5);
      tbody.append(tr);
    });
  }
}
