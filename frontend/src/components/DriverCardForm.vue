<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto" @close="close">
      <div class="flex items-center justify-center min-h-screen p-4">
        <DialogPanel class="bg-white dark:bg-gray-900 rounded shadow p-6 w-full max-w-lg">
          <div class="flex items-center justify-between mb-4">
            <button
              v-if="hasPrev"
              @click="prev"
              class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronLeft class="w-5 h-5" />
            </button>
            <DialogTitle class="text-lg font-medium">{{ card ? 'Edit Driver Card' : 'New Driver Card' }}</DialogTitle>
            <button
              v-if="hasNext"
              @click="next"
              class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronRight class="w-5 h-5" />
            </button>
          </div>
          <Skeleton v-if="loading" variant="form" :fields="6" />
          <form v-else @submit.prevent="submit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Card Type</label>
              <input v-model="cardType" type="text" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
              <p v-if="errors.cardType" class="text-red-600 text-sm">{{ errors.cardType }}</p>
            </div>
            <div>
              <HeadlessSelect v-model="facilityId" :options="facilityOptions" label="Facility" />
              <p v-if="errors.facilityId" class="text-red-600 text-sm">{{ errors.facilityId }}</p>
            </div>
            <div>
              <HeadlessSelect v-model="driverId" :options="driverOptions" label="Driver" />
              <p v-if="errors.driverId" class="text-red-600 text-sm">{{ errors.driverId }}</p>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="block text-sm font-medium mb-1">Issue Date</label>
                <DatePicker v-model="issueDate" :initial-type="'hijri'" language="ar" />
                <p v-if="errors.issueDate" class="text-red-600 text-sm">{{ errors.issueDate }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Expiration Date</label>
                <DatePicker v-model="expirationDate" :initial-type="'hijri'" language="ar" />
                <p v-if="errors.expirationDate" class="text-red-600 text-sm">{{ errors.expirationDate }}</p>
              </div>
            </div>
            <div>
              <HeadlessSelect v-model="supplier" :options="supplierOptions" label="Supplier" />
            </div>
            <div class="text-end">
              <button type="submit" :disabled="!isValid" class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Save</button>
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
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useDriverCardFormStore } from '@/stores/driverCardForm'
import DatePicker from 'vue3-hijri-gregorian-datepicker'
import 'vue3-hijri-gregorian-datepicker/dist/style.css'
import HeadlessSelect from '@/components/HeadlessSelect.vue'
import Skeleton from '@/components/Skeleton.vue'
import { getFacilities } from '@/api/facilities'
import { getDrivers } from '@/api/drivers'
import { createDriverCard, updateDriverCard } from '@/api/driverCards'
import api from '@/services/axios'
import { useNotificationStore } from '@/stores/notifications'

const STORAGE_KEY = 'draftDriverCard'

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

const formStore = useDriverCardFormStore()
const notificationStore = useNotificationStore()

const hasPrev = computed(() => formStore.index > 0)
const hasNext = computed(() => formStore.index < formStore.cards.length - 1)

function prev() {
  if (hasPrev.value) formStore.index--
}

function next() {
  if (hasNext.value) formStore.index++
}

const facilities = ref([])
const drivers = ref([])
const suppliers = ref([])
const loading = ref(true)
const errors = ref({})
const touched = ref({
  cardType: false,
  facilityId: false,
  driverId: false,
  issueDate: false,
  expirationDate: false
})

function validate() {
  errors.value.cardType = touched.value.cardType && !cardType.value ? 'Card type required' : ''
  errors.value.facilityId = touched.value.facilityId && !facilityId.value ? 'Facility required' : ''
  errors.value.driverId = touched.value.driverId && !driverId.value ? 'Driver required' : ''
  errors.value.issueDate = touched.value.issueDate && !issueDate.value.date ? 'Issue date required' : ''
  errors.value.expirationDate = touched.value.expirationDate && !expirationDate.value.date ? 'Expiration date required' : ''
}

watch(cardType, (v, o) => {
  if (o !== undefined) touched.value.cardType = true
  validate()
})
watch(facilityId, (v, o) => {
  if (o !== undefined) touched.value.facilityId = true
  validate()
})
watch(driverId, (v, o) => {
  if (o !== undefined) touched.value.driverId = true
  validate()
})
watch(() => issueDate.value.date, (v, o) => {
  if (o !== undefined) touched.value.issueDate = true
  validate()
})
watch(() => expirationDate.value.date, (v, o) => {
  if (o !== undefined) touched.value.expirationDate = true
  validate()
})

const isValid = computed(() =>
  cardType.value && facilityId.value && driverId.value && issueDate.value.date && expirationDate.value.date &&
  Object.values(errors.value).every(e => !e)
)

const facilityOptions = computed(() => facilities.value.map(f => ({ value: f.FacilityID, label: `${f.Name} - ${f.IdentityNumber}` })))
const driverOptions = computed(() => drivers.value.map(d => ({ value: d.DriverID, label: `${d.FirstName} ${d.LastName} - ${d.IdentityNumber}` })))
const supplierOptions = computed(() => suppliers.value.map(s => ({ value: s.id, label: s.name })))

watch(
  () => ({
    cardType: cardType.value,
    facilityId: facilityId.value,
    driverId: driverId.value,
    issueDate: issueDate.value,
    expirationDate: expirationDate.value,
    supplier: supplier.value
  }),
  val => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  },
  { deep: true }
)

function close() {
  emit('update:modelValue', false)
  localStorage.removeItem(STORAGE_KEY)
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
  touched.value = {
    cardType: false,
    facilityId: false,
    driverId: false,
    issueDate: false,
    expirationDate: false
  }
  validate()
}, { immediate: true })

onMounted(async () => {
  loading.value = true
  const [fac, drv] = await Promise.all([
    getFacilities(),
    getDrivers()
  ])
  const { data: supData } = await api.get('/suppliers')
  facilities.value = fac || []
  drivers.value = drv || []
  suppliers.value = supData
  loading.value = false

  if (!props.card) {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const d = JSON.parse(stored)
        cardType.value = d.cardType || ''
        facilityId.value = d.facilityId || ''
        driverId.value = d.driverId || ''
        issueDate.value = d.issueDate || { date: '', type: 'hijri' }
        expirationDate.value = d.expirationDate || { date: '', type: 'hijri' }
        supplier.value = d.supplier || ''
      } catch {}
    }
  }
})

async function submit() {
  touched.value.cardType = true
  touched.value.facilityId = true
  touched.value.driverId = true
  touched.value.issueDate = true
  touched.value.expirationDate = true
  validate()
  if (!isValid.value) {
    notificationStore.pushError('❌ يوجد أخطاء في النموذج')
    return
  }

  const payload = {
    CardType: cardType.value,
    FacilityID: facilityId.value,
    DriverID: driverId.value,
    IssueDate: issueDate.value.date,
    ExpirationDate: expirationDate.value.date,
    Supplier: supplier.value || null
  }
  let result
  if (props.card) {
    result = await updateDriverCard(props.card.ID, payload)
  } else {
    result = await createDriverCard(payload)
  }
  if (result) {
    localStorage.removeItem(STORAGE_KEY)
    emit('saved')
    notificationStore.pushSuccess('✅ تم الحفظ')
    close()
  } else {
    notificationStore.pushError('❌ حدث خطأ أثناء الحفظ')
  }
}
</script>

<style scoped>
</style>

