import api from '@/services/axios'

export async function getDriverCards() {
  try {
    const { data } = await api.get('/driver-cards')
    return data
  } catch (error) {
    console.error('Failed to fetch driver cards', error)
    return null
  }
}

export async function getDriverCard(id) {
  try {
    const { data } = await api.get(`/driver-cards/${id}`)
    return data
  } catch (error) {
    console.error('Failed to fetch driver card', error)
    return null
  }
}

export async function getDriverCardByDriver(driverId) {
  try {
    const { data } = await api.get(`/driver-cards/by-driver/${driverId}`)
    return data
  } catch (error) {
    console.error('Failed to fetch driver card by driver', error)
    return null
  }
}

export async function createDriverCard(payload) {
  try {
    const { data } = await api.post('/driver-cards', payload)
    return data
  } catch (error) {
    console.error('Failed to create driver card', error)
    return null
  }
}

export async function updateDriverCard(id, payload) {
  try {
    const { data } = await api.put(`/driver-cards/${id}`, payload)
    return data
  } catch (error) {
    console.error('Failed to update driver card', error)
    return null
  }
}

export async function deleteDriverCard(id) {
  try {
    const { data } = await api.delete(`/driver-cards/${id}`)
    return data
  } catch (error) {
    console.error('Failed to delete driver card', error)
    return null
  }
}
