import GarageView from "./view/garage-view/page";
import HeaderView from "./view/header/header";
// import WinnersView from "./view/winner-view/page";

function buildSpa() {
  const body = document.getElementById("body") as HTMLElement;
  const header = new HeaderView();
  const garagePage = new GarageView();
  // const winnersPage = new WinnersView();
  body?.append(header.create(), garagePage.create());
  return body;
}

document.addEventListener("DOMContentLoaded", buildSpa);
