<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">New Vehicle</h1>
    <form @submit.prevent="submit" class="space-y-4">
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Facility ID</label>
          <input v-model="facilityId" type="number" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plate Number</label>
          <input v-model="plate" type="text" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Serial Number</label>
          <input v-model="serial" type="text" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
        </div>
      </div>
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createVehicle } from '@/api/vehicles'
import { useNotificationStore } from '@/stores/notifications'

const facilityId = ref('')
const plate = ref('')
const serial = ref('')
const notificationStore = useNotificationStore()

async function submit() {
  try {
    await createVehicle({
      FacilityID: facilityId.value || null,
      PlateNumber: plate.value,
      SerialNumber: serial.value
    })
    facilityId.value = ''
    plate.value = ''
    serial.value = ''
  } catch (err) {
    notificationStore.pushError('❌ حدث خطأ أثناء الحفظ')
  }
}
</script>
