export const state = {
  board: Array(3).fill(null).map(() => Array(3).fill("")),
  currentPlayer: "X",
  winner: null as string | null,
  gameOver: false,
};