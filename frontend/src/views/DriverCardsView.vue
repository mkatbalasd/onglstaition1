<template>
  <div class="space-y-4 text-gray-800 dark:text-gray-100 ltr:text-left rtl:text-right">
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
import { useDataStore } from '@/stores/data'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/notifications'

const store = useDataStore()
const { driverCards: cards } = storeToRefs(store)
const loading = ref(true)
const notificationStore = useNotificationStore()

onMounted(async () => {
  try {
    await store.fetchDriverCards()
  } catch (err) {
    notificationStore.pushError('❌ حدث خطأ أثناء التحميل')
  } finally {
    loading.value = false
  }
})
</script>
