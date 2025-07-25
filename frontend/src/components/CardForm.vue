<template>
  <Modal v-model="visible" :title="title">
    <form @submit.prevent="handleSubmit">
      <FormSelect v-model="form.FacilityID" label="Facility" required>
        <option value="" disabled>Select facility</option>
        <option v-for="f in facilities" :key="f.FacilityID" :value="f.FacilityID">
          {{ f.Name }}
        </option>
      </FormSelect>
      <FormSelect v-model="form.VehicleID" label="Vehicle" required>
        <option value="" disabled>Select vehicle</option>
        <option v-for="v in vehicles" :key="v.ID" :value="v.ID">
          {{ v.PlateNumber }}
        </option>
      </FormSelect>
      <FormSelect v-model="form.DriverID" label="Driver">
        <option value="">None</option>
        <option v-for="d in drivers" :key="d.DriverID" :value="d.DriverID">
          {{ d.FirstName }} {{ d.LastName }}
        </option>
      </FormSelect>
      <FormSelect v-model="form.Supplier" label="Supplier">
        <option value="">None</option>
        <option v-for="s in suppliers" :key="s.SupplierID" :value="s.SupplierID">
          {{ s.Name }}
        </option>
      </FormSelect>
      <FormInput v-model="form.IssueDate" type="date" label="Issue Date" />
      <FormInput v-model="form.ExpirationDate" type="date" label="Expiration Date" />
      <FormInput v-model="form.RenewalDate" type="date" label="Renewal Date" />
      <FormInput v-model="form.CardNumber" label="Card Number" readonly />
      <div class="flex justify-end space-x-2 rtl:space-x-reverse">
        <button type="button" @click="visible = false" class="px-4 py-2 rounded bg-gray-200">Cancel</button>
        <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Modal from '@/components/Modal.vue'
import FormSelect from '@/components/FormSelect.vue'
import FormInput from '@/components/FormInput.vue'
import cardApi from '@/api/cards'
import { useCardStore } from '@/stores/card'
import { useVehicleStore } from '@/stores/vehicle'
import { useDriverStore } from '@/stores/driver'
import { useFacilityStore } from '@/stores/facility'
import { useSupplierStore } from '@/stores/supplier'
import { useToastStore } from '@/stores/toast'

const props = defineProps({
  modelValue: Boolean,
  card: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const cardStore = useCardStore()
const vehicleStore = useVehicleStore()
const driverStore = useDriverStore()
const facilityStore = useFacilityStore()
const supplierStore = useSupplierStore()
const toast = useToastStore()

const vehicles = computed(() => vehicleStore.allItems || vehicleStore.items)
const drivers = computed(() => driverStore.items)
const facilities = computed(() => facilityStore.items)
const suppliers = computed(() => supplierStore.items)

const form = ref({
  FacilityID: '',
  VehicleID: '',
  DriverID: '',
  IssueDate: '',
  ExpirationDate: '',
  RenewalDate: '',
  Supplier: '',
  CardNumber: '',
})

onMounted(() => {
  if (vehicleStore.items.length === 0) vehicleStore.fetch()
  if (driverStore.items.length === 0) driverStore.fetch()
  if (facilityStore.items.length === 0) facilityStore.fetch()
  if (supplierStore.items.length === 0) supplierStore.fetch()
  const draft = localStorage.getItem('draftCard')
  if (draft && !props.card) {
    Object.assign(form.value, JSON.parse(draft))
  }
})

watch(
  () => props.card,
  c => {
    if (c) {
      form.value = { ...c }
    } else {
      form.value = {
        FacilityID: '',
        VehicleID: '',
        DriverID: '',
        IssueDate: '',
        ExpirationDate: '',
        RenewalDate: '',
        Supplier: '',
        CardNumber: '',
      }
    }
  },
  { immediate: true }
)

watch(
  form,
  val => {
    if (!props.card) {
      localStorage.setItem('draftCard', JSON.stringify(val))
    }
  },
  { deep: true }
)

async function handleSubmit() {
  try {
    if (form.value.CardNumber === '') {
      const { data } = await cardApi.generateNumber()
      form.value.CardNumber = data.cardNumber
    }
    if (form.value.ID) {
      await cardStore.update(form.value.ID, { ...form.value })
    } else {
      await cardStore.create({ ...form.value })
    }
    localStorage.removeItem('draftCard')
    toast.success('Card saved')
    visible.value = false
  } catch (err) {
    toast.error('Failed to save')
  }
}
</script>

<style scoped>
</style>
