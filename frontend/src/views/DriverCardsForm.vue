<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">Edit Driver Card</h1>
    <SkeletonForm v-if="loading" :fields="5" />
    <div v-else class="grid gap-4 md:grid-cols-2">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Date</label>
        <DatePicker v-model="issueDate" :initial-type="'hijri'" language="ar" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiration Date</label>
        <DatePicker v-model="expirationDate" :initial-type="'hijri'" language="ar" />
      </div>
      <HeadlessSelect v-model="facilityId" :options="facilityOptions" label="Facility" />
      <HeadlessSelect v-model="selectedDriver" :options="driverOptions" label="Driver" />
      <HeadlessSelect v-model="selectedVehicle" :options="vehicleOptions" label="Vehicle" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useFormHelpers } from '@/composables/useFormHelpers'
import DatePicker from 'vue3-hijri-gregorian-datepicker'
import 'vue3-hijri-gregorian-datepicker/dist/style.css'
import SkeletonForm from '@/components/SkeletonForm.vue'
import HeadlessSelect from '@/components/HeadlessSelect.vue'

const facilities = ref([])
const selectedDriver = ref('')
const selectedVehicle = ref('')
const loading = ref(true)

const { issueDate, expirationDate, facilityId, drivers, vehicles, loadFacilityOptions } = useFormHelpers()

onMounted(async () => {
  loading.value = true
  const res = await fetch('/nagl/api/facilities')
  facilities.value = await res.json()
  loading.value = false
})

watch(facilityId, (val) => loadFacilityOptions(val))

const facilityOptions = computed(() => facilities.value.map(f => ({ value: f.FacilityID, label: f.Name })))
const driverOptions = computed(() => drivers.value.map(d => ({ value: d.DriverID, label: `${d.FirstName} ${d.LastName}` })))
const vehicleOptions = computed(() => vehicles.value.map(v => ({ value: v.ID, label: v.PlateNumber || v.SerialNumber })))
</script>
