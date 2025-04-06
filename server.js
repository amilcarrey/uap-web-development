const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


let tareas = [];


app.get("/", (req, res) => {
    res.render("index", { tareas });
});


app.post("/agregar", (req, res) => {
    const nuevaTarea = req.body.tarea;
    if (nuevaTarea.trim() !== "") {
        tareas.push({ texto: nuevaTarea, completado: false });
    }
    res.redirect("/");
});


app.post("/completar/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (tareas[id]) {
        tareas[id].completado = !tareas[id].completado;
    }
    res.redirect("/");
});


app.post("/eliminar/:id", (req, res) => {
    const id = parseInt(req.params.id);
    tareas = tareas.filter((_, index) => index !== id);
    res.redirect("/");
});


app.post("/eliminar-completadas", (req, res) => {
    tareas = tareas.filter((tarea) => !tarea.completado);
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
