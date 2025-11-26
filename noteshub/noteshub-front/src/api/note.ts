// src/api/note.ts

const API_BASE_URL = 'http://localhost:8000';
const NOTES_BASE_PATH = '/notes';

export interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export interface Note {
  id: string;
  owner: UserInfo;
  editors?: UserInfo[];
  title: string;
  texts?: string[];
  createdAt: string;
  uploadedAt: string;
}

export interface NoteIn {
  title: string;
}

export interface NoteUpdate {
  id: string;
  title: string;
  texts?: string[];
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      (data as any).detail || (data as any).message || `Error ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return data as T;
}

/**
 * Listar todas las notas del usuario autenticado
 */
export async function listNotes(token: string): Promise<Note[]> {
  const url = `${API_BASE_URL}${NOTES_BASE_PATH}/list/`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  return handleResponse<Note[]>(response);
}

/**
 * Buscar una nota específica por ID
 */
export async function findNote(id: string, token: string): Promise<Note> {
  const url = `${API_BASE_URL}${NOTES_BASE_PATH}/find/`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ id }),
  });

  return handleResponse<Note>(response);
}

/**
 * Crear una nueva nota
 */
export async function insertNote(noteData: NoteIn, token: string): Promise<{ inserted_id: string }> {
  const url = `${API_BASE_URL}${NOTES_BASE_PATH}/insert/`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(noteData),
  });

  return handleResponse<{ inserted_id: string }>(response);
}

/**
 * Actualizar una nota existente
 */
export async function updateNote(noteData: NoteUpdate, token: string): Promise<Note> {
  const url = `${API_BASE_URL}${NOTES_BASE_PATH}/update/`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(noteData),
  });

  return handleResponse<Note>(response);
}

/**
 * Eliminar una nota por ID
 */
export async function deleteNote(id: string, token: string): Promise<void> {
  const url = `${API_BASE_URL}${NOTES_BASE_PATH}/delete/`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    const data = await response.json();
    const errorMessage =
      (data as any).detail || (data as any).message || `Error ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }
}
