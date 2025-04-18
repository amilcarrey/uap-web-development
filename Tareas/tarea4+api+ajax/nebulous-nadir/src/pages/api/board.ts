import { state } from "../../state";

export async function GET() {
  const boardHtml = state.board.map((row, rowIndex) => `
    <div class="row">
      ${row.map((cell, colIndex) => {
        const disabled = cell !== "" || state.gameOver;
        return `
          <button
            type="submit"
            name="move"
            value="${rowIndex},${colIndex}"
            class="cell"
            ${disabled ? "disabled" : ""}
          >
            ${cell}
          </button>
        `;
      }).join("")}
    </div>
  `).join("");

  const status = state.gameOver
    ? (state.winner === "tie" ? "Empate" : `Gana el jugador ${state.winner}`)
    : `Turno del jugador: ${state.currentPlayer}`;

  return new Response(
    JSON.stringify({ boardHtml, status }),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
}
