<template>
  <div>
    <div class="flex justify-between mb-4">
      <div class="flex gap-2 rtl:gap-2">
        <FormInput v-model="search" placeholder="Search..." />
        <FormSelect v-model="facilityFilter" placeholder="Facility">
          <option value="">All Facilities</option>
          <option v-for="f in facilities" :key="f.FacilityID" :value="f.FacilityID">
            {{ f.Name }}
          </option>
        </FormSelect>
      </div>
      <button class="px-4 py-2 rounded bg-blue-600 text-white" @click="openForm()">
        Add Driver
      </button>
    </div>

    <DataTable :headers="['Facility','First Name','Last Name','Identity Number','Actions']">
      <tr v-for="d in paginatedDrivers" :key="d.DriverID">
        <td class="px-6 py-2">{{ facilityName(d.FacilityID) }}</td>
        <td class="px-6 py-2">{{ d.FirstName }}</td>
        <td class="px-6 py-2">{{ d.LastName }}</td>
        <td class="px-6 py-2">{{ d.IdentityNumber }}</td>
        <td class="px-6 py-2 text-right">
          <button class="text-indigo-600 mr-2" @click="openForm(d)">Edit</button>
          <button class="text-red-600" @click="deleteDriver(d.DriverID)">Delete</button>
        </td>
      </tr>
    </DataTable>

    <div class="flex justify-between items-center mt-4">
      <button class="px-3 py-1" :disabled="page === 1" @click="page--">Prev</button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button class="px-3 py-1" :disabled="page >= totalPages" @click="page++">Next</button>
    </div>

    <DriverForm v-model="showForm" :driver="selectedDriver" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import DataTable from '@/components/DataTable.vue'
import FormInput from '@/components/FormInput.vue'
import FormSelect from '@/components/FormSelect.vue'
import DriverForm from '@/components/DriverForm.vue'
import { useDriverStore } from '@/stores/driver'
import { useFacilityStore } from '@/stores/facility'
import { useToastStore } from '@/stores/toast'

const driverStore = useDriverStore()
const facilityStore = useFacilityStore()
const toast = useToastStore()

driverStore.fetch()
facilityStore.fetch()

const search = ref('')
const facilityFilter = ref('')
const showForm = ref(false)
const selectedDriver = ref(null)
const page = ref(1)
const limit = ref(driverStore.limit)

watch([search, facilityFilter], () => {
  page.value = 1
})

const facilities = computed(() => facilityStore.items)

const filteredDrivers = computed(() => {
  let data = driverStore.allItems
  if (facilityFilter.value) {
    const id = Number(facilityFilter.value)
    data = data.filter(d => d.FacilityID === id)
  }
  if (search.value) {
    const s = search.value.toLowerCase()
    data = data.filter(
      d =>
        d.FirstName.toLowerCase().includes(s) ||
        d.LastName.toLowerCase().includes(s) ||
        String(d.IdentityNumber).includes(search.value)
    )
  }
  return data
})

const totalPages = computed(() => Math.ceil(filteredDrivers.value.length / limit.value) || 1)

const paginatedDrivers = computed(() => {
  const start = (page.value - 1) * limit.value
  return filteredDrivers.value.slice(start, start + limit.value)
})

function facilityName(id) {
  const f = facilityStore.items.find(f => f.FacilityID === id)
  return f ? f.Name : ''
}

function openForm(driver = null) {
  selectedDriver.value = driver
  showForm.value = true
}

async function deleteDriver(id) {
  try {
    await driverStore.remove(id)
    toast.success('Driver deleted')
  } catch (err) {
    toast.error('Failed to delete driver')
  }
}
</script>

<style scoped>
</style>
