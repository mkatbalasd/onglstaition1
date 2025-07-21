<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">Driver Cards</h1>
    <div v-if="loading" class="space-y-2 animate-pulse">
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
    <div v-else class="overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-right">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-3 py-2">#</th>
            <th class="px-3 py-2">Card Number</th>
            <th class="px-3 py-2">Driver ID</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="c in cards" :key="c.ID" class="hover:bg-gray-50 dark:hover:bg-gray-900">
            <td class="px-3 py-2">{{ c.ID }}</td>
            <td class="px-3 py-2">{{ c.CardNumber }}</td>
            <td class="px-3 py-2">{{ c.DriverID }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const cards = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch('/nagl/api/driver-cards')
    cards.value = await res.json()
  } finally {
    loading.value = false
  }
})
</script>
