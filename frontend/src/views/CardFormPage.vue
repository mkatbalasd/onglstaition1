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

const open = ref(true)
const card = ref(null)
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  if (route.params.id) {
    const { data } = await api.get(`/cards/${route.params.id}`)
    card.value = data
  }
})

function close() {
  router.push('/cards')
}
</script>
