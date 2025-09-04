import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import type { Tab, AppState } from './types';

const DB_PATH = path.join(process.cwd(), 'src/data/state.json');

async function readState(): Promise<AppState> {
  const data = await readFile(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

async function saveState(state: AppState): Promise<void> {
  await writeFile(DB_PATH, JSON.stringify(state, null, 2));
}

export async function getTabs(): Promise<Tab[]> {
  const state = await readState();
  return state.tabs || [];
}

export async function addTab(tab: Omit<Tab, 'id'>): Promise<Tab> {
  const state = await readState();
  state.tabs = state.tabs || [];
  // Generar id incremental tipo tab-1, tab-2, ...
  let nextNum = 1;
  if (state.tabs.length > 0) {
    const nums = state.tabs
      .map(t => t.id.match(/^tab-(\d+)$/))
      .filter(Boolean)
      .map(match => parseInt(match![1], 10));
    if (nums.length > 0) {
      nextNum = Math.max(...nums) + 1;
    }
  }
  const newId = `tab-${nextNum}`;
  const newTab: Tab = { ...tab, id: newId };
  state.tabs.push(newTab);
  await saveState(state);
  return newTab;
}

export async function deleteTab(tabId: string): Promise<void> {
  if (!tabId) {
    //console.log('[DEBUG] No realizo la eliminacion del tab porque no se envio el id del tab');
    return;
  }
  const state = await readState();
  //console.log('[DEBUG] deleteTab received tabId:', tabId); // Debug para verificar el id recibido
  state.tabs = (state.tabs || []).filter(tab => tab.id !== tabId);
  // También podrías querer eliminar las tareas asociadas a ese tab
  state.tasks = state.tasks.filter(task => task.tabId !== tabId);
  await saveState(state);
}

export async function renameTab(tabId: string, newTitle: string): Promise<Tab | null> {
  const state = await readState();
  const tab = (state.tabs || []).find(tab => tab.id === tabId);
  if (tab) {
    tab.title = newTitle;
    await saveState(state);
    return tab;
  }
  return null;
}
