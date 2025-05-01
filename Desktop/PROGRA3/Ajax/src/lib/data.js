// src/lib/data.js
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/lib/data.json');

// Leer las tareas desde el archivo JSON
export function readTasks() {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  }
  return [];
}

// Escribir las tareas en el archivo JSON
export function writeTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}
