import { defineStore } from 'pinia'

let id = 0

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    items: []
  }),
  actions: {
    push(message, type = 'success') {
      const item = { id: id++, message, type }
      this.items.push(item)
      setTimeout(() => {
        this.remove(item.id)
      }, 3000)
    },
    pushSuccess(message) {
      this.push(message, 'success')
    },
    pushError(message) {
      this.push(message, 'error')
    },
    remove(id) {
      this.items = this.items.filter(i => i.id !== id)
    }
  }
})
