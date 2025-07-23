<template>
  <div class="fixed top-4 end-4 z-50 space-y-2">
    <div
      v-for="item in notifications"
      :key="item.id"
      class="px-4 py-2 rounded shadow text-white"
      :class="item.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
    >
      {{ item.message }}
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/notifications'

const store = useNotificationStore()
const { items: notifications } = storeToRefs(store)
</script>

<style scoped>
</style>
