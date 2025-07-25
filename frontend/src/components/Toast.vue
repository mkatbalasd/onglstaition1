<template>
  <transition name="fade">
    <div v-if="visible" :class="['fixed top-5 right-5 z-50 px-4 py-2 rounded shadow text-white', typeClass]">
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useToastStore } from '@/stores/toast'

const store = useToastStore()
const visible = computed(() => store.visible)
const message = computed(() => store.message)
const typeClass = computed(() => (store.type === 'error' ? 'bg-red-600' : 'bg-green-600'))
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
