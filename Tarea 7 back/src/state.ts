/**
 * this saves the state so it dosnt chance */
// src/state.ts
import fs from 'fs/promises';
import path from 'path';

/**
 * It represents a only reminder  with an id, text, and completed status
 * @typedef {Object} Reminder
 * @property {string} id - ID único del recordatorio
 * @property {string} text - Texto del recordatorio
 * @property {boolean} completed - Si está completado o no
 */

/**
 * Representa el estado de la aplicación de recordatorios
 */
type Reminder = {
  id: string;
  text: string;
  completed: boolean;
  boardId: string; // Nuevo campo para identificar el tablero
};

type RemindersState = {
  reminders: Reminder[];
  filter: 'all' | 'completed' | 'incomplete';
};

/**
 * Objeto de estado global para la aplicación de recordatorios
 * @type {RemindersState}
 */
const initialState: RemindersState = {
  reminders: [],
  filter: 'all'
};

const STATE_FILE = path.resolve(process.cwd(), 'reminders-state.json');

/**
 * Carga el estado desde el archivo o retorna el estado inicial
 * @returns {Promise<RemindersState>}
 */
async function loadState(): Promise<RemindersState> {
  try {
    const data = await fs.readFile(STATE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return initialState;
  }
}

/**
 * Guarda el estado en el archivo
 * @param {RemindersState} state 
 * @returns {Promise<void>}
 */
async function saveState(state: RemindersState): Promise<void> {
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

export const remindersState = {
  loadState,
  saveState
};