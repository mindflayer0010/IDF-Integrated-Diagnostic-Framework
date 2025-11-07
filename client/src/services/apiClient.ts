/// <reference types="vite/client" />

const API_URL = import.meta.env.VITE_API_URL;

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`);
      if (!response.ok) {
        throw new ApiError(response.status, await response.text());
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      if (error instanceof ApiError) {
        return { error: error.message };
      }
      return { error: 'Failed to connect to server' };
    }
  },

  async post<T, U = unknown>(endpoint: string, body: U): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        throw new ApiError(response.status, await response.text());
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      if (error instanceof ApiError) {
        return { error: error.message };
      }
      return { error: 'Failed to connect to server' };
    }
  }
};