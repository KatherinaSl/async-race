import GarageView from "./view/garage-view/page";
import HeaderView from "./view/header/header";
import PaginationView from "./view/pagination-view/pagination";
import WinnersView from "./view/winner-view/page";

function buildSpa() {
  const body = document.getElementById("body") as HTMLElement;
  const header = new HeaderView();
  const garagePage = new GarageView();
  const winnersPage = new WinnersView();
  const pagination = new PaginationView();
  body?.append(header.create(), garagePage.create(), pagination.create());
  if (garagePage) {
    document
      .querySelector(".navigation .button:last-child")
      ?.addEventListener("click", () => {
        document.querySelector(".garage-page")?.remove();
        document.querySelector(".pagination")?.remove();
        body.append(winnersPage.create(), pagination.create());
      });
  }

  if (winnersPage) {
    document
      .querySelector(".navigation .button:first-child")
      ?.addEventListener("click", () => {
        document.querySelector(".winners-page")?.remove();
        document.querySelector(".pagination")?.remove();
        body.append(garagePage.create(), pagination.create());
      });
  }

  return body;
}

document.addEventListener("DOMContentLoaded", buildSpa);
