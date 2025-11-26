// src/api/user.ts

// URL base de tu API de FastAPI
const API_BASE_URL = 'http://localhost:8000';
const USER_BASE_PATH = '/user';

// Tipo de usuario que devuelve la API
export interface UserOut {
  name: string;
  email: string;
  token: string;
}

/**
 * Función auxiliar para manejar la respuesta y los errores de Fetch.
 */
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
 * Registra un nuevo usuario en la API.
 */
export async function register(userData: { name: string, email: string; password: string }): Promise<UserOut> {
  const url = `${API_BASE_URL}${USER_BASE_PATH}/register/`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  return handleResponse<UserOut>(response);
}

/**
 * Inicia sesión de un usuario y obtiene un token de autenticación.
 */
export async function login(userData: { email: string; password: string }): Promise<UserOut> {
  const url = `${API_BASE_URL}${USER_BASE_PATH}/login/`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  return handleResponse<UserOut>(response);
}
