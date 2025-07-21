<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">إضافة بطاقة سائق</h1>
    <form @submit.prevent="next" class="space-y-4 max-w-sm">
      <div>
        <label class="block text-sm font-medium mb-1">رقم هوية المنشأة</label>
        <input v-model="identity" type="text" required class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
      </div>
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">متابعة</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const identity = ref('')
const router = useRouter()

async function next() {
  const res = await fetch('/nagl/api/facilities')
  const facilities = await res.json()
  const facility = facilities.find(f => f.IdentityNumber === identity.value)
  if (facility) {
    router.push(`/driver-cards/new/${facility.FacilityID}/driver`)
  } else {
    router.push({ path: '/facilities/new', query: { identity: identity.value, next: '/driver-cards/new' } })
  }
}
</script>
