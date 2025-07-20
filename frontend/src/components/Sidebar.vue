<template>
  <aside class="bg-gray-100 dark:bg-gray-800 h-full p-4">
    <nav class="space-y-2">
      <RouterLink to="/" class="flex items-center space-x-2">
        <Home class="w-4 h-4" />
        <span>Dashboard</span>
      </RouterLink>
      <RouterLink to="/driver-cards" class="flex items-center space-x-2">
        <IdCard class="w-4 h-4" />
        <span>Driver Cards</span>
      </RouterLink>
      <RouterLink to="/operating-cards" class="flex items-center space-x-2">
        <SquareKanban class="w-4 h-4" />
        <span>Operating Cards</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { Home, IdCard, SquareKanban } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
</script>

<style scoped>
</style>
