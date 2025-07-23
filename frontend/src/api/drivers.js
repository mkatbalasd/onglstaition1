import api from '@/services/axios'

export async function getDrivers(query = '') {
  try {
    const { data } = await api.get(`/drivers${query}`)
    return data
  } catch (error) {
    console.error('Failed to fetch drivers', error)
    return null
  }
}

export async function createDriver(payload) {
  try {
    const { data } = await api.post('/drivers', payload)
    return data
  } catch (error) {
    console.error('Failed to create driver', error)
    return null
  }
}
