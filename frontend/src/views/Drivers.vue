<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { getDrivers } from '@/api/drivers'
import DataTable from '@/components/DataTable.vue'
import Skeleton from '@/components/Skeleton.vue'
const DriverForm = defineAsyncComponent(() => import('@/components/DriverForm.vue'))

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
  const data = await getDrivers()
  if (data) drivers.value = data
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
    <button @click="showForm = true" class="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded">Add Driver</button>
    <Skeleton v-if="loading" :columns="columns.length" />
    <DataTable v-else :items="drivers" :columns="columns" />
    <DriverForm v-model="showForm" @saved="refresh" />
  </div>
</template>
