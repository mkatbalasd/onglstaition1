import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/nagl/api'
})

export default apiClient
