import { defineStore } from 'pinia'
import { getFacilities } from '@/api/facilities'
import { getDrivers } from '@/api/drivers'
import { getVehicles } from '@/api/vehicles'
import { getDriverCards } from '@/api/driverCards'
import { getCards } from '@/api/cards'

export const useDataStore = defineStore('data', {
  state: () => ({
    facilities: [],
    drivers: [],
    vehicles: [],
    driverCards: [],
    cards: [],
    error: null
  }),
  getters: {
    facilitiesCount: state => state.facilities.length,
    driversCount: state => state.drivers.length,
    vehiclesCount: state => state.vehicles.length,
    driverCardsCount: state => state.driverCards.length,
    cardsCount: state => state.cards.length
  },
  actions: {
    async fetchFacilities() {
      try {
        const data = await getFacilities()
        if (data) this.facilities = data
        this.error = null
      } catch (err) {
        this.error = err
      }
    },
    async fetchDrivers() {
      try {
        const data = await getDrivers()
        if (data) this.drivers = data
        this.error = null
      } catch (err) {
        this.error = err
      }
    },
    async fetchVehicles() {
      try {
        const data = await getVehicles()
        if (data) this.vehicles = data
        this.error = null
      } catch (err) {
        this.error = err
      }
    },
    async fetchDriverCards() {
      try {
        const data = await getDriverCards()
        if (data) this.driverCards = data
        this.error = null
      } catch (err) {
        this.error = err
      }
    },
    async fetchCards() {
      try {
        const data = await getCards()
        if (data) this.cards = data
        this.error = null
      } catch (err) {
        this.error = err
      }
    }
  }
})
