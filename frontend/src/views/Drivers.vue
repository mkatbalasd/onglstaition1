<template>
  <div class="space-y-4 text-gray-800 dark:text-gray-100 ltr:text-left rtl:text-right">
    <Card v-for="driver in drivers" :key="driver.DriverID" :icon="User">
      <h3 class="font-semibold">{{ driver.FirstName }} {{ driver.LastName }}</h3>
      <p class="text-sm text-gray-500">{{ driver.IdentityNumber }}</p>
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
import { User } from 'lucide-vue-next'
import { useDataStore } from '@/stores/data'
import { storeToRefs } from 'pinia'

const store = useDataStore()
const { drivers } = storeToRefs(store)
const loading = ref(true)

onMounted(async () => {
  try {
    await store.fetchDrivers()
  } finally {
    loading.value = false
  }
})
</script>
