import GarageView from "./view/garage-view/page";
import HeaderView from "./view/header/header";
import PaginationView from "./view/pagination-view/pagination";
// import WinnersView from "./view/winner-view/page";

function buildSpa() {
  const body = document.getElementById("body") as HTMLElement;
  const header = new HeaderView();
  const garagePage = new GarageView();
  const pagination = new PaginationView();
  // const winnersPage = new WinnersView();
  body?.append(header.create(), garagePage.create(), pagination.create());
  return body;
}

document.addEventListener("DOMContentLoaded", buildSpa);
