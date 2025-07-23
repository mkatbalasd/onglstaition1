<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto" @close="close">
      <div class="flex items-center justify-center min-h-screen p-4">
        <DialogPanel class="bg-white dark:bg-gray-900 rounded shadow p-6 w-full max-w-lg">
          <DialogTitle class="text-lg font-medium mb-4">{{ card ? 'Edit Card' : 'New Card' }}</DialogTitle>
          <Skeleton v-if="loading" variant="form" :fields="7" />
          <form v-else @submit.prevent="submit" class="space-y-4">
            <HeadlessSelect v-model="facilityId" :options="facilityOptions" label="Facility" />
            <div>
              <HeadlessSelect v-model="vehicleId" :options="vehicleOptions" label="Vehicle" />
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
            <HeadlessSelect v-model="supplier" :options="supplierOptions" label="Supplier" />
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
import { ref, watch, onMounted, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot } from '@headlessui/vue'
import DatePicker from 'vue3-hijri-gregorian-datepicker'
import 'vue3-hijri-gregorian-datepicker/dist/style.css'
import HeadlessSelect from '@/components/HeadlessSelect.vue'
import Skeleton from '@/components/Skeleton.vue'
import { getFacilities } from '@/api/facilities'
import { getVehicles } from '@/api/vehicles'
import api from '@/services/axios'

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
const loading = ref(true)

const facilityOptions = computed(() => facilities.value.map(f => ({ value: f.FacilityID, label: `${f.Name} - ${f.IdentityNumber}` })))
const vehicleOptions = computed(() => vehicles.value.map(v => ({ value: v.ID, label: v.PlateNumber || v.SerialNumber })))
const supplierOptions = computed(() => suppliers.value.map(s => ({ value: s.id, label: s.name })))

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
  loading.value = true
  const [fac, veh] = await Promise.all([
    getFacilities(),
    getVehicles()
  ])
  const { data: supData } = await api.get('/suppliers').catch(() => ({ data: [] }))
  facilities.value = fac || []
  vehicles.value = veh || []
  suppliers.value = supData
  loading.value = false
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
    await api.put(`/cards/${props.card.ID}`, payload)
  } else {
    await api.post('/cards', payload)
  }
  emit('saved')
  close()
}
</script>

