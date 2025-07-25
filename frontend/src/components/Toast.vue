<template>
  <div class="fixed top-5 right-5 z-50 space-y-2">
    <transition-group name="fade">
      <div
        v-for="n in notifications"
        :key="n.id"
        :class="['px-4 py-2 rounded shadow text-white', n.type === 'error' ? 'bg-red-600' : 'bg-green-600']"
      >
        {{ n.message }}
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notification'

const store = useNotificationStore()
const notifications = computed(() => store.notifications)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
