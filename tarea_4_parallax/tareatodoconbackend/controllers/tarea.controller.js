const crearTarea = async (req, res, tasks) => {
  const nombre = req.body.task;
  if (nombre && nombre.trim() !== "") {
    tasks.push({ nombre: nombre.trim(), completada: false });
  }
  res.redirect("/");
};

const eliminarTarea = async (req, res, tasks) => {
  const index = parseInt(req.body.index);
  if (!isNaN(index)) {
    tasks.splice(index, 1);
  }
  res.redirect("/");
};

const toggleTarea = async (req, res, tasks) => {
  const index = parseInt(req.body.index);
  if (!isNaN(index) && tasks[index]) {
    tasks[index].completada = !tasks[index].completada;
  }
  res.redirect("/");
};

const eliminarCompletadas = async (req, res, tasks) => {
  const tareasRestantes = tasks.filter((task) => !task.completada);
  tasks.length = 0;
  tasks.push(...tareasRestantes);
  res.redirect("/");
};

export { crearTarea, eliminarTarea, toggleTarea, eliminarCompletadas };