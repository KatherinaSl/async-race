import "./pagination.scss";
import { buildButton, buildHTMLElement } from "../../utils/create-elements";
import * as Constants from "../../constants";
import { getCars } from "../../services/api-garage";
import TracksGeneration from "../tracks/tracks";

export default class PaginationView {
  public static pageNumber = 1;

  public create(): HTMLElement {
    const div = buildHTMLElement("div", "pagination");
    const nextButton = buildButton(Constants.NAV_PAGINATION.NEXT_PAGE);
    nextButton.addEventListener("click", this.nextButtonHandler.bind(this));
    nextButton?.setAttribute("page", PaginationView.pageNumber.toString());
    const prevButton = buildButton(
      Constants.NAV_PAGINATION.PREV_PAGE,
      "button",
      true
    );
    prevButton.addEventListener("click", this.prevButtonHandler.bind(this));

    div.append(prevButton, nextButton);
    return div;
  }

  private nextButtonHandler(): void {
    document.querySelectorAll(".tracks").forEach((el) => el.remove());
    PaginationView.pageNumber += 1;
    document
      .querySelector(".pagination .button:last-child")!
      .setAttribute("page", PaginationView.pageNumber.toString());

    getCars(PaginationView.pageNumber).then((response) => {
      const track = new TracksGeneration();
      const garagePage = document.querySelector(".garage-page");

      // todo redo start
      const totalCarsCount = response.totalCount as number;
      const totalPages = Math.ceil(totalCarsCount / 7);
      //   console.log(totalPages);
      if (totalPages === PaginationView.pageNumber) {
        (
          document.querySelector(
            ".pagination button:last-child"
          ) as HTMLButtonElement
        ).disabled = true;
      }
      // todo redo end

      response.cars.forEach((car) => {
        garagePage!.append(track.create(car));
      });
    });

    (
      document.querySelector(
        ".pagination button:first-child"
      ) as HTMLButtonElement
    ).disabled = false;

    document.querySelector(".garage-page__number")!.textContent =
      `Page №${PaginationView.pageNumber}`;
  }

  private prevButtonHandler(): void {
    if (PaginationView.pageNumber === 2) {
      (
        document.querySelector(
          ".pagination button:first-child"
        ) as HTMLButtonElement
      ).disabled = true;
    }
    document.querySelectorAll(".tracks").forEach((el) => el.remove());
    PaginationView.pageNumber -= 1;

    getCars(PaginationView.pageNumber).then((response) => {
      const track = new TracksGeneration();
      const garagePage = document.querySelector(".garage-page");

      response.cars.forEach((car) => {
        garagePage!.append(track.create(car));
      });
    });

    document.querySelector(".garage-page__number")!.textContent =
      `Page №${PaginationView.pageNumber}`;
  }
}
