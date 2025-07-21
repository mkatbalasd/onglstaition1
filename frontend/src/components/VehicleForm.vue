<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto" @close="close">
      <div class="flex items-center justify-center min-h-screen p-4">
        <DialogPanel class="bg-white dark:bg-gray-900 rounded shadow p-6 w-full max-w-md">
          <DialogTitle class="text-lg font-medium mb-4">New Vehicle</DialogTitle>
          <form @submit.prevent="submit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Facility ID</label>
              <input v-model="facilityId" type="number" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Plate Number</label>
              <input v-model="plate" type="text" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Serial Number</label>
              <input v-model="serial" type="text" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
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
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot } from '@headlessui/vue'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue', 'saved'])

const facilityId = ref('')
const plate = ref('')
const serial = ref('')

function close() {
  emit('update:modelValue', false)
}

async function submit() {
  await fetch('/nagl/api/vehicles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      FacilityID: facilityId.value || null,
      PlateNumber: plate.value,
      SerialNumber: serial.value
    })
  })
  facilityId.value = ''
  plate.value = ''
  serial.value = ''
  emit('saved')
  close()
}
</script>
