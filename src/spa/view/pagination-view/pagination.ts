import "./pagination.scss";
import { buildButton, buildHTMLElement } from "../../utils/create-elements";
import * as Constants from "../../constants";

export default abstract class PaginationView {
  public static pageNumber = 1;

  protected page = 1;

  public createView(): HTMLElement {
    const div = buildHTMLElement("div", "pagination");
    const nextButton = buildButton(
      Constants.NAV_PAGINATION.NEXT_PAGE,
      "button",
      true
    );
    nextButton.id = "nextbutton";
    nextButton.addEventListener("click", this.nextButtonHandler.bind(this));
    nextButton?.setAttribute("page", `${this.page}`);
    const prevButton = buildButton(
      Constants.NAV_PAGINATION.PREV_PAGE,
      "button",
      true
    );
    prevButton.id = "prevbutton";
    prevButton.addEventListener("click", this.prevButtonHandler.bind(this));

    div.append(prevButton, nextButton);
    return div;
  }

  public clearPage(): void {
    document
      .querySelectorAll(this.getPageSelector())
      .forEach((el) => el.remove());
  }

  protected abstract nextButtonHandler(): void;

  protected abstract prevButtonHandler(): void;

  protected abstract getPageSelector(): string;
}
