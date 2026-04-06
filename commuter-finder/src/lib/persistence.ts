import fs from 'fs/promises';
import path from 'path';
import { Location, AppState, Visit } from './types';
import { DEFAULT_STATE } from './constants';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const LOCATIONS_FILE = path.join(DATA_DIR, 'locations.json');
const STATE_FILE = path.join(DATA_DIR, 'state.json');

// In future, these will be replaced with database calls.
// For now, they read/write JSON files.

export async function getBaseLocations(): Promise<Location[]> {
  const data = await fs.readFile(LOCATIONS_FILE, 'utf-8');
  return JSON.parse(data);
}

export async function getState(): Promise<AppState> {
  try {
    const data = await fs.readFile(STATE_FILE, 'utf-8');
    return { ...DEFAULT_STATE, ...JSON.parse(data) };
  } catch {
    return { ...DEFAULT_STATE, customLocations: [] };
  }
}

export async function saveState(state: Partial<AppState>): Promise<AppState> {
  const current = await getState();
  const merged = { ...current, ...state };
  await fs.writeFile(STATE_FILE, JSON.stringify(merged, null, 2));
  return merged;
}

export async function getAllLocations(): Promise<Location[]> {
  const base = await getBaseLocations();
  const state = await getState();
  return [...base, ...(state.customLocations || [])];
}

export async function addCustomLocation(location: Location): Promise<void> {
  const state = await getState();
  state.customLocations = [...(state.customLocations || []), location];
  await saveState(state);
}

export async function getNotes(locationId: string): Promise<string> {
  const state = await getState();
  return state.notes[locationId] || '';
}

export async function saveNotes(locationId: string, notes: string): Promise<void> {
  const state = await getState();
  state.notes = { ...state.notes, [locationId]: notes };
  await saveState(state);
}

export async function getVisits(locationId: string): Promise<Visit[]> {
  const state = await getState();
  return state.visits[locationId] || [];
}

export async function addVisit(locationId: string, visit: Visit): Promise<Visit[]> {
  const state = await getState();
  const visits = [visit, ...(state.visits[locationId] || [])];
  state.visits = { ...state.visits, [locationId]: visits };
  await saveState(state);
  return visits;
}

export async function removeVisit(locationId: string, index: number): Promise<Visit[]> {
  const state = await getState();
  const visits = [...(state.visits[locationId] || [])];
  visits.splice(index, 1);
  state.visits = { ...state.visits, [locationId]: visits };
  await saveState(state);
  return visits;
}
