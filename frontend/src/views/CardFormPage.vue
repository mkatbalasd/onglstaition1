<template>
  <CardForm
    v-model="open"
    :card="card"
    @saved="close"
    @update:modelValue="val => { if (!val) close() }"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CardForm from '@/views/CardForm.vue'
import api from '@/services/axios'
import { useNotificationStore } from '@/stores/notifications'

const open = ref(true)
const card = ref(null)
const route = useRoute()
const router = useRouter()
const notificationStore = useNotificationStore()

onMounted(async () => {
  if (route.params.id) {
    try {
      const { data } = await api.get(`/cards/${route.params.id}`)
      card.value = data
    } catch (err) {
      notificationStore.pushError('❌ حدث خطأ أثناء التحميل')
    }
  }
})

function close() {
  router.push('/cards')
}
</script>
