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

    <nav class="flex items-center justify-between mt-4" aria-label="Pagination">
      <button
        class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
        :disabled="page === 1"
        @click="prevPage"
      >
        Previous
      </button>
      <span class="px-4 py-2 text-sm text-gray-700">Page {{ page }} of {{ totalPages }}</span>
      <button
        class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
        :disabled="page >= totalPages"
        @click="nextPage"
      >
        Next
      </button>
    </nav>

    <DriverForm v-model="showForm" :driver="selectedDriver" />
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
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

const search = computed({
  get: () => driverStore.search,
  set: val => driverStore.setSearch(val),
})

const facilityFilter = computed({
  get: () => driverStore.facilityFilter,
  set: val => driverStore.setFacilityFilter(val),
})
const showForm = ref(false)
const selectedDriver = ref(null)
const page = computed({
  get: () => driverStore.page,
  set: val => driverStore.setPage(val),
})
const limit = computed(() => driverStore.limit)

const facilities = computed(() => facilityStore.items)

watch(page, () => driverStore.fetch(page.value))

const totalPages = computed(() => Math.ceil(driverStore.total / limit.value) || 1)

const paginatedDrivers = computed(() => driverStore.items)

function facilityName(id) {
  const f = facilityStore.items.find(f => f.FacilityID === id)
  return f ? f.Name : ''
}

function prevPage() {
  if (page.value > 1) page.value--
}

function nextPage() {
  if (page.value < totalPages.value) page.value++
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
