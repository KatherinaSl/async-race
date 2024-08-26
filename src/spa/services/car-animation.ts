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
    const startButton = (event.target as HTMLButtonElement).closest("button");
    startButton!.disabled = false;
    (document.querySelector("#racebutton") as HTMLButtonElement).disabled =
      true;
    (track!.querySelector(".button:last-child") as HTMLButtonElement).disabled =
      true;
    carImg.style.transform = `translateX(calc(${trackWidth} - ${carWidth}))`;
    if (onFinishCallback) {
      onFinishCallback(carId);
    }
  };

  animation.oncancel = (): void => {
    (document.querySelector("#racebutton") as HTMLButtonElement).disabled =
      false;
  };
  return animation;
}
