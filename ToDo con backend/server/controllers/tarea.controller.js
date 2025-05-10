import { tasks } from "../data.js";

const crearTarea = async (req, res) => {
  const nuevaTarea = {
    nombre: req.body.nombre,
    completada: false,
  };
  try {
    if (nuevaTarea.nombre) {
      tasks.push(nuevaTarea);
      res.json({
        message: "Tarea creada con éxito",
        tarea: nuevaTarea,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la tarea",
      error: error.message,
    });
    console.error("Error al crear la tarea:", error.message);
  }
};

const obtenerTareas = async (req, res) => {
  try {
    const filtro = req.query.filtro || "todos";
    let tareasFiltered = [...tasks];

    if (filtro === "pendientes") {
      tareasFiltered = tasks.filter((tarea) => !tarea.completada);
    } else if (filtro === "completadas") {
      tareasFiltered = tasks.filter((tarea) => tarea.completada);
    }

    res.json({
      message: "Tareas obtenidas con éxito",
      tareas: tareasFiltered,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las tareas",
      error: error.message,
    });
    console.error("Error al obtener las tareas:", error.message);
  }
};

const eliminarTarea = async (req, res) => {
  const index = parseInt(req.params.index);
  try {
    if (!isNaN(index) && tasks[index]) {
      tasks.splice(index, 1);
      res.redirect("/");
    } else {
      res.status(400).json({
        message: "Índice inválido",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la tarea",
      error: error.message,
    });
    console.error("Error al eliminar la tarea:", error.message);
  }
};

const toggleTarea = async (req, res) => {
  const index = parseInt(req.params.index);
  try {
    if (!isNaN(index) && tasks[index]) {
      tasks[index].completada = !tasks[index].completada;
      res.redirect("/");
    } else {
      res.status(400).json({
        message: "Índice inválido",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la tarea",
      error: error.message,
    });
    console.error("Error al actualizar la tarea:", error.message);
  }
};

const eliminarCompletadas = async (req, res) => {
  try {
    const cantidadAntes = tasks.length;
    const nuevasTareas = tasks.filter((tarea) => !tarea.completada);
    const tareasEliminadas = cantidadAntes - nuevasTareas.length;

    tasks.length = 0;
    tasks.push(...nuevasTareas);

    if (tareasEliminadas > 0) {
      res.json({
        message: `${tareasEliminadas} tareas completadas eliminadas con éxito`,
      });
    } else {
      res.status(200).json({
        message: "No hay tareas completadas para eliminar",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar las tareas completadas",
      error: error.message,
    });
    console.error("Error al eliminar las tareas completadas:", error.message);
  }
};

export {
  crearTarea,
  obtenerTareas,
  eliminarTarea,
  toggleTarea,
  eliminarCompletadas,
};
