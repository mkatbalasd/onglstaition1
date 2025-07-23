import { defineStore } from 'pinia'
import api from '@/services/axios'
import { getFacilities } from '@/api/facilities'
import { getDrivers } from '@/api/drivers'
import { getVehicles } from '@/api/vehicles'
import { getDriverCards } from '@/api/driverCards'

export const useDataStore = defineStore('data', {
  state: () => ({
    facilities: [],
    drivers: [],
    vehicles: [],
    driverCards: [],
    cards: []
  }),
  actions: {
    async fetchFacilities() {
      const data = await getFacilities()
      if (data) this.facilities = data
    },
    async fetchDrivers() {
      const data = await getDrivers()
      if (data) this.drivers = data
    },
    async fetchVehicles() {
      const data = await getVehicles()
      if (data) this.vehicles = data
    },
    async fetchDriverCards() {
      const data = await getDriverCards()
      if (data) this.driverCards = data
    },
    async fetchCards() {
      const { data } = await api.get('/cards')
      this.cards = data
    }
  }
})
