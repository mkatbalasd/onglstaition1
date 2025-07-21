<script setup>
import { ref, onMounted } from 'vue'
import DataTable from '@/components/DataTable.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'
import VehicleForm from '@/components/VehicleForm.vue'

const vehicles = ref([])
const loading = ref(true)
const showForm = ref(false)

const columns = [
  { key: 'ID', label: '#' },
  { key: 'PlateNumber', label: 'Plate' },
  { key: 'SerialNumber', label: 'Serial' }
]

async function load() {
  const res = await fetch('/nagl/api/vehicles')
  vehicles.value = await res.json()
}

onMounted(async () => {
  try {
    await load()
  } finally {
    loading.value = false
  }
})

function refresh() {
  load()
}
</script>

<template>
  <div class="space-y-4 text-gray-800 dark:text-gray-100 ltr:text-left rtl:text-right">
    <button @click="showForm = true" class="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded">Add Vehicle</button>
    <SkeletonTable v-if="loading" :columns="columns.length" />
    <DataTable v-else :items="vehicles" :columns="columns" />
    <VehicleForm v-model="showForm" @saved="refresh" />
  </div>
</template>
