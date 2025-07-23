<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import DataTable from '@/components/DataTable.vue'
import Skeleton from '@/components/Skeleton.vue'
import { getVehicles } from '@/api/vehicles'
import { useNotificationStore } from '@/stores/notifications'
const VehicleForm = defineAsyncComponent(() => import('@/components/VehicleForm.vue'))
const notificationStore = useNotificationStore()

const vehicles = ref([])
const loading = ref(true)
const showForm = ref(false)

const columns = [
  { key: 'ID', label: '#' },
  { key: 'PlateNumber', label: 'Plate' },
  { key: 'SerialNumber', label: 'Serial' }
]

async function load() {
  try {
    const data = await getVehicles()
    if (data) vehicles.value = data
  } catch (err) {
    notificationStore.pushError('❌ حدث خطأ أثناء التحميل')
  }
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
    <Skeleton v-if="loading" :columns="columns.length" />
    <DataTable v-else :items="vehicles" :columns="columns" />
    <VehicleForm v-model="showForm" @saved="refresh" />
  </div>
</template>
