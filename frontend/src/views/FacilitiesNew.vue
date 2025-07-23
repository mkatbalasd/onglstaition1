<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">New Facility</h1>
    <form @submit.prevent="submit" class="space-y-4">
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <input v-model="name" type="text" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
          <p v-if="errors.name" class="text-red-600 text-sm">{{ errors.name }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Identity Number</label>
          <input v-model="identity" type="text" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
          <p v-if="errors.identity" class="text-red-600 text-sm">{{ errors.identity }}</p>
        </div>
        <HeadlessSelect v-model="licenseType" :options="licenseOptions" label="License Type" />
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Date</label>
          <DatePicker v-model="issueDate" :initial-type="'hijri'" language="ar" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiration Date</label>
          <DatePicker v-model="expirationDate" :initial-type="'hijri'" language="ar" />
        </div>
      </div>
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DatePicker from 'vue3-hijri-gregorian-datepicker'
import 'vue3-hijri-gregorian-datepicker/dist/style.css'
import HeadlessSelect from '@/components/HeadlessSelect.vue'

const route = useRoute()
const router = useRouter()

const name = ref('')
const identity = ref(route.query.identity || '')
const licenseType = ref('')
const issueDate = ref({ date: '', type: 'hijri' })
const expirationDate = ref({ date: '', type: 'hijri' })
const licenseTypes = ref([])
const errors = ref({})

const licenseOptions = computed(() =>
  licenseTypes.value.map(t => ({ value: t.LicenseTypeNameAR, label: t.LicenseTypeNameAR }))
)

onMounted(async () => {
  const res = await fetch('/nagl/api/license-types')
  licenseTypes.value = await res.json()
})

async function submit() {
  errors.value = {}
  if (!name.value) errors.value.name = 'Name required'
  if (!identity.value) errors.value.identity = 'Identity required'
  if (Object.keys(errors.value).length) return

  const res = await fetch('/nagl/api/facilities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Name: name.value,
      IdentityNumber: identity.value,
      LicenseType: licenseType.value,
      LicenseIssueDate: issueDate.value.date,
      LicenseExpirationDate: expirationDate.value.date
    })
  })
  const data = await res.json()
  const id = data.FacilityID
  if (route.query.next) {
    router.push(`${route.query.next}/${id}/driver`)
  } else {
    name.value = ''
    identity.value = ''
    licenseType.value = ''
    issueDate.value = { date: '', type: 'hijri' }
    expirationDate.value = { date: '', type: 'hijri' }
  }
}
</script>
