import { defineStore } from 'pinia'
import licenseTypeApi from '@/api/licenseTypes'

export const useLicenseTypeStore = defineStore('licenseType', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
    page: 1,
    limit: 10,
    total: 0,
  }),
  actions: {
    async fetch(page = this.page) {
      this.loading = true
      this.error = null
      try {
        const { data } = await licenseTypeApi.getAll()
        this.total = data.length
        this.page = page
        const start = (page - 1) * this.limit
        this.items = data.slice(start, start + this.limit)
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async create(payload) {
      this.loading = true
      this.error = null
      try {
        await licenseTypeApi.create(payload)
        await this.fetch(this.page)
      } catch (err) {
        this.error = err
        throw err
      } finally {
        this.loading = false
      }
    },
    async update(id, payload) {
      this.loading = true
      this.error = null
      try {
        await licenseTypeApi.update(id, payload)
        await this.fetch(this.page)
      } catch (err) {
        this.error = err
        throw err
      } finally {
        this.loading = false
      }
    },
    async remove(id) {
      this.loading = true
      this.error = null
      try {
        await licenseTypeApi.remove(id)
        await this.fetch(this.page)
      } catch (err) {
        this.error = err
        throw err
      } finally {
        this.loading = false
      }
    },
    setPage(page) {
      this.page = page
      this.fetch(page)
    },
    setLimit(limit) {
      this.limit = limit
      this.fetch(this.page)
    },
  },
})
