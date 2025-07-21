<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto" @close="close">
      <div class="flex items-center justify-center min-h-screen p-4">
        <DialogPanel class="bg-white dark:bg-gray-900 rounded shadow p-6 w-full max-w-lg">
          <DialogTitle class="text-lg font-medium mb-4">{{ card ? 'Edit Driver Card' : 'New Driver Card' }}</DialogTitle>
          <form @submit.prevent="submit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Card Type</label>
              <input v-model="cardType" type="text" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" required />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Facility</label>
              <select v-model="facilityId" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" required>
                <option value="">Select...</option>
                <option v-for="f in facilities" :key="f.FacilityID" :value="f.FacilityID">
                  {{ f.Name }} - {{ f.IdentityNumber }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Driver</label>
              <select v-model="driverId" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" required>
                <option value="">Select...</option>
                <option v-for="d in drivers" :key="d.DriverID" :value="d.DriverID">
                  {{ d.FirstName }} {{ d.LastName }} - {{ d.IdentityNumber }}
                </option>
              </select>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="block text-sm font-medium mb-1">Issue Date</label>
                <DatePicker v-model="issueDate" :initial-type="'hijri'" language="ar" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Expiration Date</label>
                <DatePicker v-model="expirationDate" :initial-type="'hijri'" language="ar" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Supplier</label>
              <select v-model="supplier" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700">
                <option value="">Select...</option>
                <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>
            <div class="text-end">
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot } from '@headlessui/vue'
import DatePicker from 'vue3-hijri-gregorian-datepicker'
import 'vue3-hijri-gregorian-datepicker/dist/style.css'

const props = defineProps({
  modelValue: Boolean,
  card: { type: Object, default: null }
})
const emit = defineEmits(['update:modelValue', 'saved'])

const cardType = ref('')
const facilityId = ref('')
const driverId = ref('')
const issueDate = ref({ date: '', type: 'hijri' })
const expirationDate = ref({ date: '', type: 'hijri' })
const supplier = ref('')

const facilities = ref([])
const drivers = ref([])
const suppliers = ref([])

function close() {
  emit('update:modelValue', false)
}

watch(() => props.card, (val) => {
  if (val) {
    cardType.value = val.CardType || ''
    facilityId.value = val.FacilityID || ''
    driverId.value = val.DriverID || ''
    issueDate.value = { ...issueDate.value, date: val.IssueDate || '' }
    expirationDate.value = { ...expirationDate.value, date: val.ExpirationDate || '' }
    supplier.value = val.Supplier || ''
  } else {
    cardType.value = ''
    facilityId.value = ''
    driverId.value = ''
    issueDate.value = { ...issueDate.value, date: '' }
    expirationDate.value = { ...expirationDate.value, date: '' }
    supplier.value = ''
  }
}, { immediate: true })

onMounted(async () => {
  const [facRes, drvRes, supRes] = await Promise.all([
    fetch('/nagl/api/facilities'),
    fetch('/nagl/api/drivers'),
    fetch('/nagl/api/suppliers')
  ])
  facilities.value = await facRes.json()
  drivers.value = await drvRes.json()
  suppliers.value = await supRes.json()
})

async function submit() {
  const payload = {
    CardType: cardType.value,
    FacilityID: facilityId.value,
    DriverID: driverId.value,
    IssueDate: issueDate.value.date,
    ExpirationDate: expirationDate.value.date,
    Supplier: supplier.value || null
  }
  if (props.card) {
    await fetch(`/nagl/api/driver-cards/${props.card.ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } else {
    await fetch('/nagl/api/driver-cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  }
  emit('saved')
  close()
}
</script>

<style scoped>
</style>

