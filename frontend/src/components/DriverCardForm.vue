<template>
  <Modal v-model="visible" title="Driver Card">
    <form @submit.prevent="handleSubmit">
      <div v-if="step === 1">
        <FormInput v-model="form.FacilityID" label="Facility ID" required @blur="checkFacility" />
        <p v-if="facility" class="text-sm text-gray-600">{{ facility.Name }}</p>
      </div>
      <div v-if="step === 2">
        <FormInput v-model="form.DriverID" label="Driver ID" required @blur="checkDriver" />
        <p v-if="driver" class="text-sm text-gray-600">{{ driver.FirstName }} {{ driver.LastName }}</p>
      </div>
      <div v-if="step === 3">
        <FormSelect v-model="form.CardType" label="Card Type" required>
          <option value="">Select type</option>
          <option value="temporary">Temporary</option>
          <option value="permanent">Permanent</option>
        </FormSelect>
        <FormSelect v-model="form.Supplier" label="Supplier" required>
          <option value="">Select supplier</option>
          <option v-for="s in suppliers" :key="s.SupplierID" :value="s.SupplierID">
            {{ s.Name }}
          </option>
        </FormSelect>
        <FormInput v-model="form.IssueDate" type="date" label="Issue Date" />
        <FormInput v-model="form.ExpirationDate" type="date" label="Expiration Date" />
        <FormInput v-model="form.CardNumber" label="Card Number" readonly />
        <div class="flex justify-end space-x-2 rtl:space-x-reverse">
          <button type="button" @click="visible = false" class="px-4 py-2 rounded bg-gray-200">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
        </div>
      </div>
      <div class="flex justify-between mt-4" v-if="step < 3">
        <button type="button" @click="prevStep" v-if="step > 1">&#8592;</button>
        <button type="button" @click="nextStep">&#8594;</button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import Modal from '@/components/Modal.vue'
import FormInput from '@/components/FormInput.vue'
import FormSelect from '@/components/FormSelect.vue'
import facilityApi from '@/api/facilities'
import driverApi from '@/api/drivers'
import driverCardApi from '@/api/driverCards'
import cardApi from '@/api/cards'
import { useSupplierStore } from '@/stores/supplier'
import { useDriverCardStore } from '@/stores/driverCard'
import { useNotificationStore } from '@/stores/notification'

const props = defineProps({
  modelValue: Boolean,
  card: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const supplierStore = useSupplierStore()
const driverCardStore = useDriverCardStore()
const notify = useNotificationStore()

const form = ref({
  FacilityID: '',
  DriverID: '',
  CardType: '',
  Supplier: '',
  IssueDate: '',
  ExpirationDate: '',
  CardNumber: '',
})

const step = ref(1)
const facility = ref(null)
const driver = ref(null)

const suppliers = computed(() => supplierStore.items)

onMounted(() => {
  if (supplierStore.items.length === 0) supplierStore.fetch()
  const draft = localStorage.getItem('draftDriverCard')
  if (draft && !props.card) {
    const data = JSON.parse(draft)
    Object.assign(form.value, data.form)
    step.value = data.step
  }
})

watch(
  () => props.card,
  c => {
    if (c) {
      form.value = { ...c }
      step.value = 3
    } else {
      form.value = { FacilityID: '', DriverID: '', CardType: '', Supplier: '', IssueDate: '', ExpirationDate: '', CardNumber: '' }
      step.value = 1
    }
  },
  { immediate: true }
)

watch(
  [form, step],
  () => {
    if (!props.card) {
      localStorage.setItem('draftDriverCard', JSON.stringify({ form: form.value, step: step.value }))
    }
  },
  { deep: true }
)

function nextStep() {
  if (step.value < 3) step.value++
}
function prevStep() {
  if (step.value > 1) step.value--
}

async function checkFacility() {
  if (!form.value.FacilityID) return
  try {
    const { data } = await facilityApi.getById(form.value.FacilityID)
    facility.value = data
  } catch {
    facility.value = null
  }
}

async function checkDriver() {
  if (!form.value.DriverID) return
  try {
    const { data } = await driverApi.getById(form.value.DriverID)
    driver.value = data
    const { data: cards } = await driverCardApi.getAll()
    const existing = cards.find(c => c.DriverID == form.value.DriverID && c.FacilityID == form.value.FacilityID)
    if (existing) {
      form.value = { ...existing }
      step.value = 3
    } else {
      const { data: res } = await cardApi.generateNumber()
      form.value.CardNumber = res.cardNumber
    }
  } catch {
    driver.value = null
  }
}

async function handleSubmit() {
  try {
    if (form.value.ID) {
      await driverCardStore.update(form.value.ID, { ...form.value })
    } else {
      await driverCardStore.create({ ...form.value })
    }
    localStorage.removeItem('draftDriverCard')
    notify.success('Driver card saved')
    visible.value = false
  } catch (err) {
    notify.error('Failed to save')
  }
}
</script>

<style scoped>
</style>
