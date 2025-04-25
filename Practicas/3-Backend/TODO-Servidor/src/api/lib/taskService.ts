//src\api\lib\taskService.ts

import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import type { Task, AppState } from './types';

const DB_PATH = path.join(process.cwd(), 'src/data/state.json');

export async function readState(): Promise<AppState> {
  try {
    const data = await readFile(DB_PATH, 'utf-8');
    return JSON.parse(data) || { tasks: [], currentTab: 'personal', currentFilter: 'all' };
  } catch (error) {
    console.error('Error reading state:', error);
    return { tasks: [], currentTab: 'personal', currentFilter: 'all' };
  }
}

export async function getFilteredTasks(tab: string, filter: string): Promise<Task[]> {
  const state = await readState();
  return state.tasks.filter(t => 
    t.tabId === tab &&
    (filter === 'all' || 
     (filter === 'completed' && t.completed) || 
     (filter === 'active' && !t.completed))
  );
}

export async function saveState(state: AppState): Promise<void> {
  try {
    await writeFile(DB_PATH, JSON.stringify(state, null, 2));
  } catch (error) {
    console.error('Error saving state:', error);
  }
} 

// Operaciones específicas
export async function addTask(task: Omit<Task, 'id'>): Promise<Task> {
  const state = await readState();
  const newTask = { ...task, id: Date.now().toString() };
  state.tasks.push(newTask);
  await saveState(state);
  return newTask;
}

export async function toggleTask(id: string): Promise<Task | null> {
  const state = await readState();
  const task = state.tasks.find(t => t.id === id);
  if (task) {
    //console.log(`Toggling task with ID: ${id}`);
    task.completed = !task.completed;
    await saveState(state);
    return task;
  }
  //console.error('Task not found:', id);
  return null;
}

export async function deleteTask(id: string): Promise<void> {
  const state = await readState();
  state.tasks = state.tasks.filter(t => t.id !== id);
  await saveState(state);
}

export async function clearCompleted(tabId: string): Promise<void> {
  const state = await readState();
  state.tasks = state.tasks.filter(t => !(t.tabId === tabId && t.completed));
  await saveState(state);
}