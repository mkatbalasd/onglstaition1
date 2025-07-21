<template>
  <TransitionRoot :show="open" as="aside" class="bg-gray-50 dark:bg-gray-800 h-full p-4 font-sans">
    <nav class="space-y-2">
      <RouterLink
        to="/"
        class="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700"
      >
        <Home class="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span class="text-gray-700 dark:text-gray-100">Dashboard</span>
      </RouterLink>
      <RouterLink
        to="/driver-cards"
        class="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700"
      >
        <IdCard class="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span class="text-gray-700 dark:text-gray-100">Driver Card List</span>
      </RouterLink>
      <RouterLink
        to="/operating-cards"
        class="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700"
      >
        <SquareKanban class="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span class="text-gray-700 dark:text-gray-100">Operating Cards</span>
      </RouterLink>
      <RouterLink
        to="/facilities"
        class="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700"
      >
        <Building2 class="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span class="text-gray-700 dark:text-gray-100">Facilities</span>
      </RouterLink>
      <RouterLink
        to="/drivers"
        class="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700"
      >
        <Users class="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span class="text-gray-700 dark:text-gray-100">Drivers</span>
      </RouterLink>
      <RouterLink
        to="/vehicles"
        class="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700"
      >
        <Truck class="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span class="text-gray-700 dark:text-gray-100">Vehicles</span>
      </RouterLink>
    </nav>
  </TransitionRoot>
</template>

<script setup>
import { Home, IdCard, SquareKanban, Building2, Users, Truck } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { TransitionRoot } from '@headlessui/vue'

const props = defineProps({
  open: { type: Boolean, default: true }
})
</script>

<style scoped>
</style>
