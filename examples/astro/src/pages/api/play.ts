import type { APIRoute } from "astro";
import { state } from "../../state";

// Game state management
const BOARD_SIZE = 3;

// Function to check for winner
function checkWinner(board: string[][]): string | null {
  // Check rows
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (
      board[i][0] &&
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2]
    ) {
      return board[i][0];
    }
  }

  // Check columns
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (
      board[0][i] &&
      board[0][i] === board[1][i] &&
      board[1][i] === board[2][i]
    ) {
      return board[0][i];
    }
  }

  // Check diagonals
  if (
    board[0][0] &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2]
  ) {
    return board[0][0];
  }
  if (
    board[0][2] &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0]
  ) {
    return board[0][2];
  }

  // Check for tie
  if (board.every((row) => row.every((cell) => cell !== ""))) {
    return "tie";
  }

  return null;
}

const parseFormData = async (request: Request) => {
  const formData = await request.formData();
  const move = formData.get("move")?.toString();
  const reset = formData.get("reset")?.toString();
  return { move, reset };
};

const parseJson = async (
  request: Request
): Promise<{ move: string | undefined; reset: string | undefined }> => {
  return await request.json();
};



export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-type");
  try {
    const { move, reset } =
      contentType === "application/x-www-form-urlencoded"
        ? await parseFormData(request)
        : await parseJson(request);

    if (move) {
      const [row, col] = move.split(",").map(Number);
      if (state.board[row][col] === "") {
        state.board[row][col] = state.currentPlayer;
        state.winner = checkWinner(state.board);

        if (state.winner) {
          state.gameOver = true;
        } else {
          state.currentPlayer = state.currentPlayer === "X" ? "O" : "X";
        }
      }
    }

    if (reset) {
      state.board = Array(BOARD_SIZE)
        .fill(null)
        .map(() => Array(BOARD_SIZE).fill(""));
      state.currentPlayer = "X";
      state.winner = null;
      state.gameOver = false;
    }
  } catch (error) {
    console.error("Error processing form data:", error);
  }


  if (contentType === "application/x-www-form-urlencoded") {
    return redirect("/tateti");
  }
  if (contentType === "application/json") {
    return new Response(JSON.stringify(state), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response("Invalid content type", { status: 400 });
};