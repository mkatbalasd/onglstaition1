<template>
  <Modal v-model="visible" :title="title">
    <form @submit.prevent="handleSubmit">
      <FormSelect v-model="form.BrandID" label="Brand" placeholder="Select brand" required>
        <option value="" disabled>Select brand</option>
        <option v-for="b in brands" :key="b.BrandID" :value="b.BrandID">
          {{ b.BrandName }}
        </option>
      </FormSelect>
      <FormSelect v-model="form.ModelID" label="Model" placeholder="Select model" required>
        <option value="" disabled>Select model</option>
        <option v-for="m in models" :key="m.ModelID" :value="m.ModelID">
          {{ m.ModelName }}
        </option>
      </FormSelect>
      <FormSelect v-model="form.ColorID" label="Color" placeholder="Select color" required>
        <option value="" disabled>Select color</option>
        <option v-for="c in colors" :key="c.ColorID" :value="c.ColorID">
          {{ c.ColorName }}
        </option>
      </FormSelect>
      <FormSelect v-model="form.FacilityID" label="Facility" placeholder="Select facility">
        <option value="" disabled>Select facility</option>
        <option v-for="f in facilities" :key="f.FacilityID" :value="f.FacilityID">
          {{ f.Name }}
        </option>
      </FormSelect>
      <FormInput v-model="form.PlateNumber" label="Plate Number" />
      <FormInput v-model="form.SerialNumber" label="Serial Number" />
      <FormInput v-model="form.ManufacturingYear" type="number" label="Manufacturing Year" />
      <div class="flex justify-end space-x-2 rtl:space-x-reverse">
        <button type="button" @click="visible = false" class="px-4 py-2 rounded bg-gray-200">Cancel</button>
        <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import FormSelect from '@/components/FormSelect.vue'
import FormInput from '@/components/FormInput.vue'
import { useVehicleStore } from '@/stores/vehicle'
import { useBrandStore } from '@/stores/brand'
import { useModelStore } from '@/stores/model'
import { useColorStore } from '@/stores/color'
import { useFacilityStore } from '@/stores/facility'
import { useToastStore } from '@/stores/toast'

const props = defineProps({
  modelValue: Boolean,
  vehicle: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const vehicleStore = useVehicleStore()
const brandStore = useBrandStore()
const modelStore = useModelStore()
const colorStore = useColorStore()
const facilityStore = useFacilityStore()
const toast = useToastStore()

const brands = computed(() => brandStore.items)
const models = computed(() => modelStore.items)
const colors = computed(() => colorStore.items)
const facilities = computed(() => facilityStore.items)

const form = ref({
  BrandID: '',
  ModelID: '',
  ColorID: '',
  FacilityID: '',
  PlateNumber: '',
  SerialNumber: '',
  ManufacturingYear: '',
})

watch(
  () => props.vehicle,
  v => {
    if (v) {
      form.value = { ...v }
    } else {
      form.value = { BrandID: '', ModelID: '', ColorID: '', FacilityID: '', PlateNumber: '', SerialNumber: '', ManufacturingYear: '' }
    }
  },
  { immediate: true }
)

const title = computed(() => (props.vehicle ? 'Edit Vehicle' : 'Add Vehicle'))

if (brandStore.items.length === 0) brandStore.fetch()
if (modelStore.items.length === 0) modelStore.fetch()
if (colorStore.items.length === 0) colorStore.fetch()
if (facilityStore.items.length === 0) facilityStore.fetch()

async function handleSubmit() {
  try {
    if (props.vehicle) {
      await vehicleStore.update(props.vehicle.ID, { ...form.value })
    } else {
      await vehicleStore.create({ ...form.value })
    }
    toast.success('Vehicle saved successfully')
    visible.value = false
    await vehicleStore.fetch(vehicleStore.page)
  } catch (err) {
    toast.error('Failed to save vehicle')
  }
}
</script>

<style scoped>
</style>
