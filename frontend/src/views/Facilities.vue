<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import DataTable from '@/components/DataTable.vue'
import Skeleton from '@/components/Skeleton.vue'
import { getFacilities } from '@/api/facilities'
import { useNotificationStore } from '@/stores/notifications'
const FacilityForm = defineAsyncComponent(() => import('@/components/FacilityForm.vue'))
const notificationStore = useNotificationStore()

const facilities = ref([])
const loading = ref(true)
const showForm = ref(false)

const columns = [
  { key: 'FacilityID', label: '#' },
  { key: 'Name', label: 'Name' },
  { key: 'IdentityNumber', label: 'Identity' },
  { key: 'LicenseType', label: 'License' }
]

async function load() {
  try {
    const data = await getFacilities()
    if (data) facilities.value = data
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
    <button @click="showForm = true" class="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded">Add Facility</button>
    <Skeleton v-if="loading" :columns="columns.length" />
    <DataTable v-else :items="facilities" :columns="columns" />
    <FacilityForm v-model="showForm" @saved="refresh" />
  </div>
</template>
