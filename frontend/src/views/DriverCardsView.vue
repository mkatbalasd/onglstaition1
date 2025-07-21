<template>
  <div class="space-y-4">
    <Card v-for="c in cards" :key="c.ID" :icon="IdCard">
      <h3 class="font-semibold">{{ c.CardNumber }}</h3>
      <p class="text-sm text-gray-500">{{ c.FirstName }} - {{ c.Name }}</p>
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
import { IdCard } from 'lucide-vue-next'

const cards = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch('/nagl/api/driver-cards')
    cards.value = await res.json()
  } finally {
    loading.value = false
  }
})
</script>
