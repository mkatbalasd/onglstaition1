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
      <button type="submit" :disabled="!isValid" class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Save</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DatePicker from 'vue3-hijri-gregorian-datepicker'
import 'vue3-hijri-gregorian-datepicker/dist/style.css'
import HeadlessSelect from '@/components/HeadlessSelect.vue'
import { createFacility } from '@/api/facilities'
import api from '@/services/axios'

const route = useRoute()
const router = useRouter()

const name = ref('')
const identity = ref(route.query.identity || '')
const licenseType = ref('')
const issueDate = ref({ date: '', type: 'hijri' })
const expirationDate = ref({ date: '', type: 'hijri' })
const licenseTypes = ref([])
const errors = ref({})
const touched = ref({ name: false, identity: false })

function validate() {
  errors.value.name = touched.value.name && !name.value ? 'Name required' : ''
  errors.value.identity = touched.value.identity && !identity.value ? 'Identity required' : ''
}

watch(name, (v, o) => {
  if (o !== undefined) touched.value.name = true
  validate()
})
watch(identity, (v, o) => {
  if (o !== undefined) touched.value.identity = true
  validate()
})

const isValid = computed(() => name.value && identity.value && Object.values(errors.value).every(e => !e))

const licenseOptions = computed(() =>
  licenseTypes.value.map(t => ({ value: t.LicenseTypeNameAR, label: t.LicenseTypeNameAR }))
)

onMounted(async () => {
  const { data } = await api.get('/license-types')
  licenseTypes.value = data
})

async function submit() {
  touched.value.name = true
  touched.value.identity = true
  validate()
  if (!isValid.value) return

  const data = await createFacility({
    Name: name.value,
    IdentityNumber: identity.value,
    LicenseType: licenseType.value,
    LicenseIssueDate: issueDate.value.date,
    LicenseExpirationDate: expirationDate.value.date
  })
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
