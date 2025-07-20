<template>
  <div class="space-y-4">
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

const drivers = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch('/api/drivers')
    drivers.value = await res.json()
  } finally {
    loading.value = false
  }
})
</script>
