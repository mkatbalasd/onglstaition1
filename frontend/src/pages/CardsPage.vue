<script setup>
import { ref, onMounted } from 'vue'
import DataTable from '@/components/DataTable.vue'

const cards = ref([])
const loading = ref(true)

const columns = [
  { key: 'ID', label: '#' },
  { key: 'CardNumber', label: 'Card Number' },
  { key: 'VehicleID', label: 'Vehicle' }
]

onMounted(async () => {
  try {
    const res = await fetch('/nagl/api/cards')
    cards.value = await res.json()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-4">
    <div v-if="loading" class="space-y-2 animate-pulse">
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
    <DataTable v-else :items="cards" :columns="columns" />
  </div>
</template>
