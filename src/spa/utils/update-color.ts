export default function updateColor(carColor: string): string {
  if (carColor.length === 4) {
    const colorArr = carColor.slice(1).split("");
    const color = `#${colorArr[0]}${colorArr[0]}${colorArr[1]}${colorArr[1]}${colorArr[2]}${colorArr[2]}`;
    return color;
  }

  return carColor;
}
