<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto" @close="close">
      <div class="flex items-center justify-center min-h-screen p-4">
        <DialogPanel class="bg-white dark:bg-gray-900 rounded shadow p-6 w-full max-w-md">
          <DialogTitle class="text-lg font-medium mb-4">New Driver</DialogTitle>
          <form @submit.prevent="submit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Facility ID</label>
              <input v-model="facilityId" type="number" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Identity Number</label>
              <input v-model="identity" type="text" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">First Name</label>
              <input v-model="firstName" type="text" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Last Name</label>
              <input v-model="lastName" type="text" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
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
import { createDriver } from '@/api/drivers'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue', 'saved'])

const facilityId = ref('')
const identity = ref('')
const firstName = ref('')
const lastName = ref('')

function close() {
  emit('update:modelValue', false)
}

async function submit() {
  await createDriver({
    FacilityID: facilityId.value || null,
    IdentityNumber: identity.value,
    FirstName: firstName.value,
    LastName: lastName.value
  })
  facilityId.value = ''
  identity.value = ''
  firstName.value = ''
  lastName.value = ''
  emit('saved')
  close()
}
</script>
