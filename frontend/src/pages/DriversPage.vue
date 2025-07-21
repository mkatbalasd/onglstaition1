<script setup>
import { ref, onMounted } from 'vue'
import DataTable from '@/components/DataTable.vue'
import DriverForm from '@/components/DriverForm.vue'

const drivers = ref([])
const loading = ref(true)
const showForm = ref(false)

const columns = [
  { key: 'DriverID', label: '#' },
  { key: 'FirstName', label: 'First Name' },
  { key: 'LastName', label: 'Last Name' },
  { key: 'IdentityNumber', label: 'Identity' }
]

async function load() {
  const res = await fetch('/nagl/api/drivers')
  drivers.value = await res.json()
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
  <div class="space-y-4">
    <button @click="showForm = true" class="px-4 py-2 bg-blue-600 text-white rounded">Add Driver</button>
    <div v-if="loading" class="space-y-2 animate-pulse">
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
    <DataTable v-else :items="drivers" :columns="columns" />
    <DriverForm v-model="showForm" @saved="refresh" />
  </div>
</template>
