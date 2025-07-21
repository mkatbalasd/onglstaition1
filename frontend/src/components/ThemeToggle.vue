<template>
  <button
    class="p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400"
    @click="toggle"
  >
    <component :is="isDark ? Sun : Moon" class="w-5 h-5" />
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'

const isDark = ref(false)

function toggle() {
  window.toggleDark()
  isDark.value = document.documentElement.classList.contains('dark')
}

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
})
</script>
