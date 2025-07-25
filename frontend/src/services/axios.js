import axios from 'axios';

// Allow configuring the API base path from the environment. When no value is
// provided, default to the path used when the frontend is served from `/nagl/`.
const baseURL = import.meta.env.VITE_API_BASE || '/nagl/api';

const api = axios.create({
  baseURL,
});

export default api;
