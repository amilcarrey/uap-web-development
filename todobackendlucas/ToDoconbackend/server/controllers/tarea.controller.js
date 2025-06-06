import { tasks } from "../data.js";

const crearTarea = async (req, res) => {
  const nuevaTarea = {
    nombre: req.body.nombre,
    tableroId: req.body.tableroId,
    completada: false,
  };
  try {
    if (nuevaTarea.nombre && nuevaTarea.tableroId) {
      tasks.push(nuevaTarea);
      res.json({
        message: "Tarea creada con éxito",
        tarea: nuevaTarea,
      });
    } else {
      res.status(400).json({ message: "Faltan campos requeridos" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la tarea",
      error: error.message,
    });
  }
};

const obtenerTareas = async (req, res) => {
  try {
    const filtro = req.query.filtro || "todos";
    const tableroId = req.query.tableroId;

    if (!tableroId) {
      return res.status(400).json({ message: "Falta el tableroId" });
    }

    let tareasFiltered = tasks.filter((t) => t.tableroId === tableroId);

    if (filtro === "pendientes") {
      tareasFiltered = tareasFiltered.filter((t) => !t.completada);
    } else if (filtro === "completadas") {
      tareasFiltered = tareasFiltered.filter((t) => t.completada);
    }

    res.json({ message: "Tareas obtenidas con éxito", tareas: tareasFiltered });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las tareas",
      error: error.message,
    });
  }
};

const eliminarTarea = async (req, res) => {
  const index = parseInt(req.params.index);
  try {
    if (!isNaN(index) && tasks[index]) {
      tasks.splice(index, 1);
      res.json({ message: "Tarea eliminada con éxito" });
    } else {
      res.status(400).json({ message: "Índice inválido" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar la tarea", error: error.message });
  }
};

const toggleTarea = async (req, res) => {
  const index = parseInt(req.params.index);
  try {
    if (!isNaN(index) && tasks[index]) {
      tasks[index].completada = !tasks[index].completada;
      res.json({ message: "Tarea actualizada con éxito", tarea: tasks[index] });
    } else {
      res.status(400).json({ message: "Índice inválido" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la tarea", error: error.message });
  }
};

const actualizarTarea = async (req, res) => {
  const index = parseInt(req.params.index);
  const { nombre, completada } = req.body;

  try {
    if (!isNaN(index) && tasks[index]) {
      if (nombre !== undefined) tasks[index].nombre = nombre;
      if (completada !== undefined) tasks[index].completada = completada;
      res.json({ message: "Tarea actualizada con éxito", tarea: tasks[index] });
    } else {
      res.status(400).json({ message: "Índice inválido" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la tarea", error: error.message });
  }
};

export {
  crearTarea,
  obtenerTareas,
  eliminarTarea,
  toggleTarea,
  actualizarTarea,
};
