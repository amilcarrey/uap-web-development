import type { APIRoute } from "astro";
import { state } from "../../state";

export const POST: APIRoute = async () => {
  state.board = Array(3).fill(null).map(() => Array(3).fill(""));
  state.currentPlayer = "X";
  state.winner = null;
  state.gameOver = false;

  return new Response(null, {
    status: 303,
    headers: { Location: "/" },
  });
};
