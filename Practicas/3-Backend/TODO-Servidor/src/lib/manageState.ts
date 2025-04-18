// src/lib/manageState.ts
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/state.json');

// Leer tareas
export async function getTasks(): Promise<any[]> {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data).tasks || [];
    } catch (error) {
      console.error('Error leyendo state.json:', error);
      return [];
    }
  }

// Guardar tareas
export async function saveTasks(tasks: any[]) {
    await fs.writeFile(filePath, JSON.stringify({ tasks }, null, 2));
  }

interface Task {
  id: string;
  text: string;
  completed: boolean;
  tabId: string;
}