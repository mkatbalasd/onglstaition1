import api from '@/services/axios'

export async function getFacilities() {
  try {
    const { data } = await api.get('/facilities')
    return data
  } catch (error) {
    console.error('Failed to fetch facilities', error)
    return null
  }
}

export async function createFacility(payload) {
  try {
    const { data } = await api.post('/facilities', payload)
    return data
  } catch (error) {
    console.error('Failed to create facility', error)
    return null
  }
}
