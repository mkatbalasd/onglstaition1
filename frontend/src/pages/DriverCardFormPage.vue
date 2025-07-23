<template>
  <DriverCardForm
    v-model="open"
    :card="card"
    @saved="close"
    @update:modelValue="val => { if (!val) close() }"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DriverCardForm from '@/components/DriverCardForm.vue'
import { getDriverCard } from '@/api/driverCards'

const route = useRoute()
const router = useRouter()

const open = ref(true)
const card = ref(null)

onMounted(async () => {
  if (route.params.id) {
    const data = await getDriverCard(route.params.id)
    if (data) {
      card.value = data
    }
  } else {
    card.value = {
      FacilityID: route.params.facilityId || '',
      DriverID: route.params.driverId || ''
    }
  }
})

function close() {
  router.push('/driver-cards')
}
</script>
