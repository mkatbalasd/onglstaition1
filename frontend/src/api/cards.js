import resourceApi from './resource'
import api from '@/services/axios'

const base = resourceApi('cards')

export default {
  ...base,
  generateNumber(prefix = '') {
    return api.post('/cards/generate-number', { prefix })
  },
}
