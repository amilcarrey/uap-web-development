export function renderHome(req, res, tasks) {
  res.setHeader("Content-Type", "text/html");

  const filtro = req.query.filtro || "todos";
  let tasksFiltradas = tasks;

  if (filtro === "completadas") {
    tasksFiltradas = tasks.filter((task) => task.completada);
  } else if (filtro === "pendientes") {
    tasksFiltradas = tasks.filter((task) => !task.completada);
  }

  const taskListHTML = tasksFiltradas
    .map(
      (task, index) => `
      <li>
      <form method="POST" action="/toggle" style="display:inline;">
        <input type="hidden" name="index" value="${index}" />
        <button type="submit">${task.completada ? "✅" : "⬜️"}</button>
      </form>
      ${task.completada ? `<s>${task.nombre}</s>` : task.nombre}
      <form method="POST" action="/delete" style="display:inline;">
        <input type="hidden" name="index" value="${index}" />
        <button type="submit">🗑️</button>
      </form>
    </li>
    `
    )
    .join("");

  res.send(`
          <!DOCTYPE html>
    <html>
    <head>
    <title>ToDo</title>
    <style>
    body {
      font-family: apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      text-align: center;
        color: #333;
        font-size: 2.5em;
        
    }
    form {
      margin-bottom: 10px;
        display: flex;
        justify-content: center;
    }
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 5px;
}
    input[type="text"] {
      padding: 5px;
      width: 70%;
        border-radius: 4px;
        border: 1px solid #ccc;
        font-size: 1em;
        transition: border-color 0.3s;
    }
    button {
        padding: 5px 10px;
        background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1em;
            transition: background-color 0.3s, transform 0.3s;
    }
    a{
    text-decoration: none;
    color: #333;
        font-weight: bold;
    }
}
    ul {
        
    }
    li {
      padding: 5px 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    s {
      color: gray;
    }
    button:hover {
        background-color: #0056b3;
            transform: scale(1.05);
        }
    .filtros {
        text-align: center;
            margin-top: 10px;
        }
    </style>
    </head>
    <body>
      <h1>ToDo </h1>
      <form method="POST" action="/add">
        <input type="text" name="task" placeholder="Nueva tarea" required />
        <button type="submit">Agregar</button>
      </form>
      <div class="filtros" style="margin-top: 10px;">
        <strong>Filtrar:</strong>
        <a href="/">Todas</a> |
        <a href="/?filtro=pendientes">Pendientes</a> |
        <a href="/?filtro=completadas">Completadas</a>
      </div>
        <div style="margin-top: 10px;">
            <form method="POST" action="/delete-completed" style="margin-top:10px;">
            <button type="submit">🧹 Eliminar Tareas Completadas</button>
            </form>
            </form>
      <ul >
        ${taskListHTML}
        </ul>
        </body>
        </html>
    `);
}