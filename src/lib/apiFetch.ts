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
  
  // Prevent double /api/v1 by stripping it from the endpoint if it was passed manually
  const cleanEndpoint = endpoint.replace(/^\/?api\/v1/, '');
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${cleanEndpoint.startsWith('/') ? cleanEndpoint : `/${cleanEndpoint}`}`;

  return fetch(url, {
    ...options,
    headers,
  });
};
