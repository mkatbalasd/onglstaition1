import { defineStore } from 'pinia'

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
      this.facilities = await fetch('/nagl/api/facilities').then(r => r.json())
    },
    async fetchDrivers() {
      this.drivers = await fetch('/nagl/api/drivers').then(r => r.json())
    },
    async fetchVehicles() {
      this.vehicles = await fetch('/nagl/api/vehicles').then(r => r.json())
    },
    async fetchDriverCards() {
      this.driverCards = await fetch('/nagl/api/driver-cards').then(r => r.json())
    },
    async fetchCards() {
      this.cards = await fetch('/nagl/api/cards').then(r => r.json())
    }
  }
})
