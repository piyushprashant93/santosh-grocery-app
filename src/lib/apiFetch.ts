import { API_BASE_URL } from '../config';

/**
 * A wrapper around native fetch that automatically:
 * 1. Prepends the API_BASE_URL to relative paths.
 * 2. Attaches the Authorization Bearer token from localStorage.
 */
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  const headers = new Headers(options.headers || {});
  
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  return fetch(url, {
    ...options,
    headers,
  });
};
