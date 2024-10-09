export default function makeCarAnimation(
  event: Event,
  time: number,
  carId: number,
  onFinishCallback?: (carId: number) => void
): Animation {
  const track = document.querySelector(`#car-${carId}`);
  const carImg = track?.querySelector(".car-img") as HTMLDivElement;
  const trackWidth = getComputedStyle(
    track?.querySelector(".car") as HTMLElement
  ).width;
  const carWidth = getComputedStyle(
    track?.querySelector(".car svg") as HTMLElement
  ).width;

  const animation = carImg.animate(
    [
      { transform: "translateX(0px)" },
      { transform: `translateX(calc(${trackWidth} - ${carWidth}))` },
    ],
    {
      duration: time,
      easing: "ease-in-out",
    }
  );

  animation.onfinish = (): void => {
    carImg.style.transform = `translateX(calc(${trackWidth} - ${carWidth}))`;
    if (onFinishCallback) {
      onFinishCallback(carId);
    }
  };

  animation.oncancel = (): void => {
    (document.querySelector("#racebutton") as HTMLButtonElement).disabled =
      false;
    (document.querySelector("#startbutton") as HTMLButtonElement).disabled =
      false;
    (document.querySelector("#resetbutton") as HTMLButtonElement).disabled =
      true;
    (carImg as HTMLDivElement).style.transform = "translateX(0px)";
  };
  return animation;
}
