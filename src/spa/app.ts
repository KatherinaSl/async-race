import { buildHTMLElement } from "./utils/create-elements";
import GarageView from "./view/garage-view/page";
import HeaderView from "./view/header/header";
import WinnersView from "./view/winner-view/page";

function buildSpa() {
  const body = document.getElementById("body") as HTMLElement;
  const header = new HeaderView();
  const garagePage = new GarageView();
  const winnersPage = new WinnersView();
  body?.append(header.create(), garagePage.create());

  document.querySelector("#winnerbutton")?.addEventListener("click", () => {
    document.querySelector(".garage-page")?.remove();
    (document.querySelector("#winnerbutton") as HTMLButtonElement).disabled =
      true;
    (document.querySelector("#garagebutton") as HTMLButtonElement).disabled =
      false;
    body.append(winnersPage.create());
  });

  document.querySelector("#garagebutton")?.addEventListener("click", () => {
    document.querySelector(".winners-page")?.remove();
    (document.querySelector("#winnerbutton") as HTMLButtonElement).disabled =
      false;
    (document.querySelector("#garagebutton") as HTMLButtonElement).disabled =
      true;
    body.append(garagePage.create());
  });

  return body;
}

window.addEventListener("unhandledrejection", (event) => {
  // console.log(`unhandled: ${event.reason}`);
  const errorMessage = `Something went wrong. Please, contact system administrator`;
  const div = buildHTMLElement("div", "error-message");
  const p = buildHTMLElement("p");
  p.textContent = errorMessage;
  div.append(p);
  document.querySelector("body")?.append(div);
  event.preventDefault();
});

document.addEventListener("DOMContentLoaded", buildSpa);
