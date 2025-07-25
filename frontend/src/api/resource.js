import api from '@/services/axios';

export default function resourceApi(resource) {
  return {
    getAll: (params = {}) => api.get(`/${resource}`, { params }),
    getById: (id) => api.get(`/${resource}/${id}`),
    create: (data) => api.post(`/${resource}`, data),
    update: (id, data) => api.put(`/${resource}/${id}`, data),
    remove: (id) => api.delete(`/${resource}/${id}`),
  };
}
