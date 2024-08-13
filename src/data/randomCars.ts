import { Car } from "./data";

const brands: string[] = [
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Bugatti",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Citroën",
  "Dodge",
  "Ferrari",
  "Fiat",
  "Ford",
  "Honda",
  "Hummer",
  "Hyundai",
  "Infiniti",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lada",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lotus",
  "Maserati",
  "Maybach",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "Mitsubishi",
  "Nissan",
  "Opel",
  "Peugeot",
  "Porsche",
  "Renault",
  "Rolls-Royce",
  "Skoda",
  "Subaru",
  "Suzuki",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
];

const models: string[] = [
  "Corolla",
  "Camry",
  "RAV4",
  "CR-V",
  "Sentra",
  "Civic",
  "HR-V",
  "Accord",
  "Speedtail",
  "Veyron",
  "Agera R",
  "Chiron",
  "Venom GT",
  "3 Series",
  "X1",
  "Z4",
  "X7",
  "5 Series",
  "7 Series",
  "X3",
  "M340i",
  "M4 Competition",
];

const getRandomCarName = (): string => {
  const brand: string = brands[Math.floor(Math.random() * brands.length)];
  const model: string = models[Math.floor(Math.random() * models.length)];

  return `${brand} ${model}`;
};

const getRandomColor = (): string => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const getRandomCar = (count = 100): Car[] => {
  return Array(count)
    .fill(null)
    .map(() => ({ name: getRandomCarName(), color: getRandomColor() }));
};

export default getRandomCar;
