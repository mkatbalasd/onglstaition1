<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto" @close="close">
      <div class="flex items-center justify-center min-h-screen p-4">
        <DialogPanel class="bg-white dark:bg-gray-900 rounded shadow p-6 w-full max-w-lg">
          <DialogTitle class="text-lg font-medium mb-4">{{ card ? 'Edit Card' : 'New Card' }}</DialogTitle>
          <form @submit.prevent="submit" class="space-y-4">
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
              <label class="block text-sm font-medium mb-1">Vehicle</label>
              <select v-model="vehicleId" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" required>
                <option value="">Select...</option>
                <option v-for="v in vehicles" :key="v.ID" :value="v.ID">{{ v.PlateNumber || v.SerialNumber }}</option>
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
              <label class="block text-sm font-medium mb-1">Renewal Date</label>
              <DatePicker v-model="renewalDate" :initial-type="'hijri'" language="ar" />
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

const facilityId = ref('')
const vehicleId = ref('')
const issueDate = ref({ date: '', type: 'hijri' })
const expirationDate = ref({ date: '', type: 'hijri' })
const renewalDate = ref({ date: '', type: 'hijri' })
const supplier = ref('')

const facilities = ref([])
const vehicles = ref([])
const suppliers = ref([])

function close() {
  emit('update:modelValue', false)
}

watch(
  () => props.card,
  (val) => {
    if (val) {
      facilityId.value = val.FacilityID || ''
      vehicleId.value = val.VehicleID || ''
      issueDate.value = { ...issueDate.value, date: val.IssueDate || '' }
      expirationDate.value = { ...expirationDate.value, date: val.ExpirationDate || '' }
      renewalDate.value = { ...renewalDate.value, date: val.RenewalDate || '' }
      supplier.value = val.Supplier || ''
    } else {
      facilityId.value = ''
      vehicleId.value = ''
      issueDate.value = { ...issueDate.value, date: '' }
      expirationDate.value = { ...expirationDate.value, date: '' }
      renewalDate.value = { ...renewalDate.value, date: '' }
      supplier.value = ''
    }
  },
  { immediate: true }
)

onMounted(async () => {
  const [facRes, vehRes, supRes] = await Promise.all([
    fetch('/nagl/api/facilities'),
    fetch('/nagl/api/vehicles'),
    fetch('/nagl/api/suppliers').catch(() => ({ ok: false }))
  ])
  facilities.value = await facRes.json()
  vehicles.value = await vehRes.json()
  if (supRes.ok) suppliers.value = await supRes.json()
})

async function submit() {
  const payload = {
    FacilityID: facilityId.value,
    VehicleID: vehicleId.value,
    IssueDate: issueDate.value.date,
    ExpirationDate: expirationDate.value.date,
    RenewalDate: renewalDate.value.date,
    Supplier: supplier.value || null
  }
  if (props.card) {
    await fetch(`/nagl/api/cards/${props.card.ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } else {
    await fetch('/nagl/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  }
  emit('saved')
  close()
}
</script>

