<template>
  <div class="space-y-4 text-gray-800 dark:text-gray-100 ltr:text-left rtl:text-right">
    <Card v-for="v in vehicles" :key="v.ID" :icon="Truck">
      <h3 class="font-semibold">{{ v.PlateNumber }}</h3>
      <p class="text-sm text-gray-500">{{ v.SerialNumber }}</p>
    </Card>
    <div v-if="loading" class="space-y-2 animate-pulse">
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Card from '@/components/Card.vue'
import { Truck } from 'lucide-vue-next'
import { useDataStore } from '@/stores/data'
import { storeToRefs } from 'pinia'

const store = useDataStore()
const { vehicles } = storeToRefs(store)
const loading = ref(true)

onMounted(async () => {
  try {
    await store.fetchVehicles()
  } finally {
    loading.value = false
  }
})
</script>
