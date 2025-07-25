<template>
  <Modal v-model="visible" :title="title">
    <form @submit.prevent="handleSubmit">
      <FormSelect v-model="form.FacilityID" label="Facility" placeholder="Select facility" required>
        <option value="" disabled>Select facility</option>
        <option v-for="f in facilities" :key="f.FacilityID" :value="f.FacilityID">
          {{ f.Name }}
        </option>
      </FormSelect>
      <FormInput v-model="form.FirstName" label="First Name" required />
      <FormInput v-model="form.LastName" label="Last Name" required />
      <FormInput
        v-model="form.IdentityNumber"
        label="Identity Number"
        :error="errors.IdentityNumber"
        required
      />
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
import FormInput from '@/components/FormInput.vue'
import FormSelect from '@/components/FormSelect.vue'
import { useDriverStore } from '@/stores/driver'
import { useFacilityStore } from '@/stores/facility'
import { useNotificationStore } from '@/stores/notification'

const props = defineProps({
  modelValue: Boolean,
  driver: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const driverStore = useDriverStore()
const facilityStore = useFacilityStore()
const notify = useNotificationStore()

const facilities = computed(() => facilityStore.items)

const form = ref({
  FacilityID: '',
  FirstName: '',
  LastName: '',
  IdentityNumber: '',
})

const errors = ref({ IdentityNumber: '' })

watch(
  () => props.driver,
  d => {
    if (d) {
      form.value = {
        FacilityID: d.FacilityID,
        FirstName: d.FirstName,
        LastName: d.LastName,
        IdentityNumber: d.IdentityNumber,
      }
    } else {
      form.value = { FacilityID: '', FirstName: '', LastName: '', IdentityNumber: '' }
    }
    errors.value.IdentityNumber = ''
  },
  { immediate: true }
)

const title = computed(() => (props.driver ? 'Edit Driver' : 'Add Driver'))

if (facilityStore.items.length === 0) {
  facilityStore.fetch()
}

async function handleSubmit() {
  errors.value.IdentityNumber = ''
  try {
    if (props.driver) {
      await driverStore.update(props.driver.DriverID, { ...form.value })
    } else {
      await driverStore.create({ ...form.value })
    }
    notify.success('Driver saved successfully')
    visible.value = false
    await driverStore.fetch(driverStore.page)
  } catch (err) {
    const message = err.response?.data?.error || 'Failed to save driver'
    if (message.includes('IdentityNumber')) {
      errors.value.IdentityNumber = message
    } else {
      notify.error(message)
    }
  }
}
</script>

<style scoped>
</style>
