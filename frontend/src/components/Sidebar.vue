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
      <RouterLink to="/facilities" class="flex items-center space-x-2">
        <Building2 class="w-4 h-4" />
        <span>Facilities</span>
      </RouterLink>
      <RouterLink to="/drivers" class="flex items-center space-x-2">
        <Users class="w-4 h-4" />
        <span>Drivers</span>
      </RouterLink>
      <RouterLink to="/vehicles" class="flex items-center space-x-2">
        <Truck class="w-4 h-4" />
        <span>Vehicles</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { Home, IdCard, SquareKanban, Building2, Users, Truck } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
</script>

<style scoped>
</style>
