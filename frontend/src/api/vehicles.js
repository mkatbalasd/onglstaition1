import api from '@/services/axios'

export async function getVehicles() {
  try {
    const { data } = await api.get('/vehicles')
    return data
  } catch (error) {
    console.error('Failed to fetch vehicles', error)
    return null
  }
}

export async function createVehicle(payload) {
  try {
    const { data } = await api.post('/vehicles', payload)
    return data
  } catch (error) {
    console.error('Failed to create vehicle', error)
    return null
  }
}
