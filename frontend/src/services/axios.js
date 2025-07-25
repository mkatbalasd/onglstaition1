import axios from 'axios';

// Allow configuring the API base path from the environment. When no value is
// provided, default to `/api` which matches the backend routes.
const baseURL = import.meta.env.VITE_API_BASE || '/api';

const api = axios.create({
  baseURL,
});

export default api;
