import { defineStore } from 'pinia'

export const useDriverCardFormStore = defineStore('driverCardForm', {
  state: () => ({
    index: -1,
    cards: [],
    saved: false,
    page: 1,
    pageCount: 1
  }),
  getters: {
    currentCard: state => state.index >= 0 ? state.cards[state.index] : null
  }
})
