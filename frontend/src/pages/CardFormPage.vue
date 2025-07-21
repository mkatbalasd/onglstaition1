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

const open = ref(true)
const card = ref(null)
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  if (route.params.id) {
    const res = await fetch(`/nagl/api/cards/${route.params.id}`)
    if (res.ok) {
      card.value = await res.json()
    }
  }
})

function close() {
  router.push('/cards')
}
</script>
