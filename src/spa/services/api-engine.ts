export const engineSetting = async (
  id: number,
  status: "started" | "stopped"
) => {
  const url = `http://127.0.0.1:3000/engine?id=${id}&status=${status}`;

  const response = await fetch(url, {
    method: "PATCH",
  });

  if (response.ok) {
    const responseEngine = response.json();
    return responseEngine;
  }

  throw new Error("Error while starting engine");
};

export const engineDriveMode = async (id: number, status: "drive") => {
  const url = `http://127.0.0.1:3000/engine?id=${id}&status=${status}`;

  const response = await fetch(url, {
    method: "PATCH",
  });

  if (response.ok) {
    const responseCar = response.json();
    return responseCar;
  }

  throw new Error("Error while car is moving");
};
