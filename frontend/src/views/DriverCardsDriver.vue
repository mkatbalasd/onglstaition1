<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">اختيار السائق</h1>
    <p class="text-gray-600 dark:text-gray-400" v-if="facilityName">{{ facilityName }}</p>
    <form @submit.prevent="next" class="space-y-4 max-w-sm">
      <div>
        <label class="block text-sm font-medium mb-1">رقم هوية السائق</label>
        <input v-model="identity" type="text" required class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
      </div>
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">متابعة</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const facilityId = route.params.facilityId
const identity = ref('')
const facilityName = ref('')

onMounted(async () => {
  const res = await fetch('/nagl/api/facilities')
  const facilities = await res.json()
  const facility = facilities.find(f => String(f.FacilityID) === facilityId)
  facilityName.value = facility ? facility.Name : ''
})

async function next() {
  const res = await fetch(`/nagl/api/drivers?facilityId=${facilityId}`)
  const drivers = await res.json()
  const driver = drivers.find(d => d.IdentityNumber === identity.value)
  if (driver) {
    router.push(`/driver-cards/new/${facilityId}/driver/${driver.DriverID}`)
  } else {
    router.push({ path: '/drivers/new', query: { facilityId, identity: identity.value, next: `/driver-cards/new/${facilityId}/driver` } })
  }
}
</script>
