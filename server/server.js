import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// PATCH para cambiar solo el estado completado
server.patch("/tasks/:id", (req, res) => {
  const db = router.db;
  const id = Number(req.params.id);
  const task = db.get("tasks").find({ id }).value();
  if (!task) return res.status(404).send("Not found");

  const updated = { ...task, ...req.body };
  db.get("tasks").find({ id }).assign(updated).write();
  res.status(200).json(updated);
});

// DELETE todas las completadas de un board
server.delete("/tasks", (req, res) => {
  const { board } = req.query;
  if (!board) return res.status(400).send("Falta parámetro board");

  const db = router.db;
  const tasks = db.get("tasks").filter({ board }).value();
  const completed = tasks.filter((t) => t.completed);

  completed.forEach((t) => {
    db.get("tasks").remove({ id: t.id }).write();
  });

  res.status(200).send("Completadas eliminadas");
});

server.use(router);
server.listen(3001, () => {
  console.log("📡 JSON Server running at http://localhost:3001");
});