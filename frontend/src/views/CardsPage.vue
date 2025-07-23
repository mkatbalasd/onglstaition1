<script setup>
import { ref, onMounted } from 'vue'
import DataTable from '@/components/DataTable.vue'
import Skeleton from '@/components/Skeleton.vue'
import api from '@/services/axios'
import { useNotificationStore } from '@/stores/notifications'

const cards = ref([])
const loading = ref(true)
const notificationStore = useNotificationStore()

const columns = [
  { key: 'ID', label: '#' },
  { key: 'CardNumber', label: 'Card Number' },
  { key: 'VehicleID', label: 'Vehicle' }
]

onMounted(async () => {
  try {
    const { data } = await api.get('/cards')
    cards.value = data
  } catch (err) {
    notificationStore.pushError('❌ حدث خطأ أثناء التحميل')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-4 text-gray-800 dark:text-gray-100 ltr:text-left rtl:text-right">
    <Skeleton v-if="loading" :columns="columns.length" />
    <DataTable v-else :items="cards" :columns="columns" />
  </div>
</template>
