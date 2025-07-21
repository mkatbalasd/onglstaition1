<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">Edit Driver Card</h1>
    <div class="grid gap-4 md:grid-cols-2">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Date</label>
        <DatePicker v-model="issueDate" :initial-type="'hijri'" language="ar" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiration Date</label>
        <DatePicker v-model="expirationDate" :initial-type="'hijri'" language="ar" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Facility</label>
        <select v-model="facilityId" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700">
          <option value="">اختر...</option>
          <option v-for="f in facilities" :key="f.FacilityID" :value="f.FacilityID">
            {{ f.Name }}
          </option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver</label>
        <select v-model="selectedDriver" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700">
          <option value="">اختر...</option>
          <option v-for="d in drivers" :key="d.DriverID" :value="d.DriverID">
            {{ d.FirstName }} {{ d.LastName }}
          </option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle</label>
        <select v-model="selectedVehicle" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700">
          <option value="">اختر...</option>
          <option v-for="v in vehicles" :key="v.ID" :value="v.ID">
            {{ v.PlateNumber || v.SerialNumber }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useFormHelpers } from '@/composables/useFormHelpers'
import DatePicker from 'vue3-hijri-gregorian-datepicker'
import 'vue3-hijri-gregorian-datepicker/dist/style.css'

const facilities = ref([])
const selectedDriver = ref('')
const selectedVehicle = ref('')

const { issueDate, expirationDate, facilityId, drivers, vehicles, loadFacilityOptions } = useFormHelpers()

onMounted(async () => {
  const res = await fetch('/nagl/api/facilities')
  facilities.value = await res.json()
})

watch(facilityId, (val) => loadFacilityOptions(val))
</script>
