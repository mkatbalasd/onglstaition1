import axios from 'axios';

// Base URL comes from the environment file. Fallback to the local backend.
const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const api = axios.create({
  baseURL,
});

export default api;
