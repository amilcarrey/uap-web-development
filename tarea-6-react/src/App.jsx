// src/App.jsx
import React, { useState } from "react";
import "./styles/main.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [input, setInput] = useState("");

  const filteredTasks = tasks.filter(task => {
    if (filter === "complete") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  const handleAddTask = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setTasks([...tasks, { text: input.trim(), completed: false }]);
      setInput("");
    }
  };

  const handleToggle = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const handleDelete = (index) => {
    const updated = [...tasks];
    updated.splice(index, 1);
    setTasks(updated);
  };

  const handleClearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  return (
    <div className="app-container">
      <h1>Antes de Ameri</h1>
      <img src="/duki.jpg" alt="Duki" />

      <form onSubmit={handleAddTask} className="form-tarea">
        <input
          type="text"
          placeholder="What do you want to add?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <button type="submit">Agregar</button>
      </form>

      <div className="filtros">
        <button onClick={() => setFilter("all")}>Todas</button>
        <button onClick={() => setFilter("incomplete")}>Incompletas</button>
        <button onClick={() => setFilter("complete")}>Completadas</button>
      </div>

      <ul id="lista-tareas">
        {filteredTasks.map((task, index) => (
          <li key={index}>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(index)}
              />
              <span className="checkmark" />
            </label>
            <span className="task-text" style={{ textDecoration: task.completed ? "line-through" : "none" }}>
              {task.text}
            </span>
            <button className="delete-btn" onClick={() => handleDelete(index)}>🗑️</button>
          </li>
        ))}
      </ul>

      <button id="clear-btn" onClick={handleClearCompleted}>Clear Completed</button>
    </div>
  );
}

export default App;
