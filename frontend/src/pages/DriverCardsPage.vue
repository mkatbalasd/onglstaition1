<script setup>
import { ref, onMounted } from 'vue'
import DataTable from '@/components/DataTable.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'

const cards = ref([])
const loading = ref(true)

const columns = [
  { key: 'ID', label: '#' },
  { key: 'CardNumber', label: 'Card Number' },
  { key: 'DriverID', label: 'Driver ID' }
]

onMounted(async () => {
  try {
    const res = await fetch('/nagl/api/driver-cards')
    cards.value = await res.json()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-4">
    <SkeletonTable v-if="loading" :columns="columns.length" />
    <DataTable v-else :items="cards" :columns="columns" />
  </div>
</template>
