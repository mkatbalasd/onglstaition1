<template>
  <header class="bg-white dark:bg-gray-900 shadow p-4 flex justify-between items-center">
    <h1 class="text-xl font-semibold">My App</h1>
    <nav class="flex space-x-4">
      <button class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
        <Bell class="w-5 h-5" />
      </button>
      <button class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
        <User class="w-5 h-5" />
      </button>
    </nav>
  </header>
</template>

<script setup>
import { Bell, User } from 'lucide-vue-next'
</script>

<style scoped>
</style>
