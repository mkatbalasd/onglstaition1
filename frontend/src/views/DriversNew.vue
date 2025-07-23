<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">New Driver</h1>
    <form @submit.prevent="submit" class="space-y-4">
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Facility ID</label>
          <input v-model="facilityId" type="number" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Identity Number</label>
          <input v-model="identity" type="text" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
          <input v-model="firstName" type="text" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
          <input v-model="lastName" type="text" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
        </div>
      </div>
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const facilityId = ref(route.query.facilityId || '')
const identity = ref(route.query.identity || '')
const firstName = ref('')
const lastName = ref('')

async function submit() {
  const res = await fetch('/nagl/api/drivers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      FacilityID: facilityId.value || null,
      IdentityNumber: identity.value,
      FirstName: firstName.value,
      LastName: lastName.value
    })
  })
  const data = await res.json()
  const id = data.DriverID
  if (route.query.next) {
    router.push(`${route.query.next}/${id}`)
  } else {
    facilityId.value = ''
    identity.value = ''
    firstName.value = ''
    lastName.value = ''
  }
}
</script>
