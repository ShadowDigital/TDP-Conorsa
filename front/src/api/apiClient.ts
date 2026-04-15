import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para añadir el token a todas las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aifront_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta globalmente
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el error es 401 (No Autorizado) y no es la petición de login
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      // Limpiar datos de sesión
      localStorage.removeItem('aifront_token');
      localStorage.removeItem('aifront_user');
      
      // Redirigir a login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);
