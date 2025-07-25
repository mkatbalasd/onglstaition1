import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
  }),
  actions: {
    push(message, type = 'success') {
      const id = Date.now() + Math.random()
      this.notifications.push({ id, message, type })
      setTimeout(() => this.remove(id), 3000)
    },
    remove(id) {
      this.notifications = this.notifications.filter(n => n.id !== id)
    },
    success(message) {
      this.push(message, 'success')
    },
    error(message) {
      this.push(message, 'error')
    },
  },
})
