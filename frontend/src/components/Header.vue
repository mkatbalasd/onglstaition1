<template>
  <header
    class="bg-blue-50 dark:bg-gray-900 shadow p-4 flex justify-between items-center rtl:flex-row-reverse"
  >
    <h1 class="text-xl font-semibold text-gray-800 dark:text-gray-100">My App</h1>
    <nav class="flex space-x-4 rtl:space-x-reverse">
      <button
        class="p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400"
        @click="toggleDark"
      >
        <component :is="dark ? Sun : Moon" class="w-5 h-5" />
      </button>
      <button
        class="p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400"
      >
        <Bell class="w-5 h-5" />
      </button>
      <button
        class="p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400"
      >
        <User class="w-5 h-5" />
      </button>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Bell, User, Sun, Moon } from 'lucide-vue-next'

const dark = ref(false)

function toggleDark() {
  dark.value = !dark.value
  const html = document.documentElement
  if (dark.value) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}

onMounted(() => {
  dark.value = document.documentElement.classList.contains('dark')
})
</script>

<style scoped>
</style>
