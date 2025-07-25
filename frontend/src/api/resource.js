import api from '@/services/axios';

export default function resourceApi(resource) {
  return {
    getAll: () => api.get(`/${resource}`),
    getById: (id) => api.get(`/${resource}/${id}`),
    create: (data) => api.post(`/${resource}`, data),
    update: (id, data) => api.put(`/${resource}/${id}`, data),
    remove: (id) => api.delete(`/${resource}/${id}`),
  };
}
