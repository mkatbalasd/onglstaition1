import api from '@/services/axios'

export async function getCards() {
  try {
    const { data } = await api.get('/cards')
    return data
  } catch (error) {
    console.error('Failed to fetch cards', error)
    return null
  }
}

export async function createCard(payload) {
  try {
    const { data } = await api.post('/cards', payload)
    return data
  } catch (error) {
    console.error('Failed to create card', error)
    return null
  }
}

export async function updateCard(id, payload) {
  try {
    const { data } = await api.put(`/cards/${id}`, payload)
    return data
  } catch (error) {
    console.error('Failed to update card', error)
    return null
  }
}

export async function deleteCard(id) {
  try {
    const { data } = await api.delete(`/cards/${id}`)
    return data
  } catch (error) {
    console.error('Failed to delete card', error)
    return null
  }
}
