import { boards } from "../data.js";
import crypto from "crypto";

const crearTablero = async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ message: "El nombre es obligatorio" });
  }

  const nuevoTablero = {
    id: crypto.randomUUID(),
    nombre,
  };

  boards.push(nuevoTablero);

  res.json({
    message: "Tablero creado con éxito",
    tablero: nuevoTablero,
  });
};

const obtenerTableros = async (req, res) => {
  res.json({
    message: "Tableros obtenidos con éxito",
    tableros: boards,
  });
};

const eliminarTablero = async (req, res) => {
  const { id } = req.params;

  const index = boards.findIndex((board) => board.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Tablero no encontrado" });
  }

  boards.splice(index, 1);

  res.json({
    message: "Tablero eliminado con éxito",
  });
};

export { crearTablero, obtenerTableros, eliminarTablero };
