import { Winner, WinnerResponse } from "../../data/data";

export const getWinners = async (
  pageNumber: number,
  limit = 10,
  sort?: "id" | "wins" | "time",
  order?: "ASC" | "DESC"
): Promise<WinnerResponse> => {
  let url = `http://127.0.0.1:3000/winners?_page=${pageNumber}&_limit=${limit}`;
  if (sort) {
    url += `&_sort=${sort}`;
  }
  if (order) {
    url += `&_order=${order}`;
  }

  const response = await fetch(url, {
    method: "GET",
  });

  if (response.ok) {
    const allWinners = await response.json();
    return {
      winners: allWinners,
      totalCount: Number(response.headers.get("X-Total-Count")),
    };
  }

  throw new Error("Error while getting all winners");
};

export const getWinner = async (id: number): Promise<Winner> => {
  const url = `http://127.0.0.1:3000/winners/${id}`;
  const response = await fetch(url, {
    method: "GET",
  });

  if (response.ok) {
    const winner = response.json();
    return winner;
  }

  throw new Error("Erro while getting winner");
};

export const createWinner = async (winner: Winner): Promise<Winner> => {
  const url = "http://127.0.0.1:3000/winners";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(winner),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const winnerResponse = response.json();
    return winnerResponse;
  }

  throw new Error("Error while creating winner");
};

export const updateWinner = async (winner: Winner): Promise<Winner> => {
  const url = `http://127.0.0.1:3000/winners/${winner.id}`;
  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(winner),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const updatedWinner = response.json();
    return updatedWinner;
  }

  throw new Error("Erro while updating winner");
};

export const deleteWinner = async (id: number): Promise<void> => {
  const url = `http://127.0.0.1:3000/winners/${id}`;
  const response = await fetch(url, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Error while deleting the car");
  }
};
