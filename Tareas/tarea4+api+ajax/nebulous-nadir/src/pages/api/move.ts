import type { APIRoute } from "astro";
import { state } from "../../state";

function checkWinner(board: string[][]): string | null {
  for (let i = 0; i < 3; i++) {
    if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) return board[i][0];
    if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) return board[0][i];
  }
  if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return board[0][0];
  if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return board[0][2];
  if (board.every(row => row.every(cell => cell !== ""))) return "tie";
  return null;
}

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const move = formData.get("move")?.toString();

  if (!move || state.gameOver) {
    return new Response(null, { status: 400 });
  }

  const [row, col] = move.split(',').map(Number);
  if (state.board[row][col] === "") {
    state.board[row][col] = state.currentPlayer;
    state.winner = checkWinner(state.board);
    state.gameOver = !!state.winner;
    if (!state.gameOver) {
      state.currentPlayer = state.currentPlayer === "X" ? "O" : "X";
    }
  }

  return new Response(null, {
    status: 303,
    headers: { Location: "/" },
  });
};
