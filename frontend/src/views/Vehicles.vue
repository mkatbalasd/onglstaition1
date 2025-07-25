<template>
  <div>
    <div class="flex justify-between mb-4">
      <div class="flex gap-2 rtl:gap-2">
        <FormSelect v-model="brandFilter" placeholder="Brand">
          <option value="">All Brands</option>
          <option v-for="b in brands" :key="b.BrandID" :value="b.BrandID">
            {{ b.BrandName }}
          </option>
        </FormSelect>
        <FormSelect v-model="modelFilter" placeholder="Model">
          <option value="">All Models</option>
          <option v-for="m in models" :key="m.ModelID" :value="m.ModelID">
            {{ m.ModelName }}
          </option>
        </FormSelect>
        <FormSelect v-model="colorFilter" placeholder="Color">
          <option value="">All Colors</option>
          <option v-for="c in colors" :key="c.ColorID" :value="c.ColorID">
            {{ c.ColorName }}
          </option>
        </FormSelect>
        <FormSelect v-model="facilityFilter" placeholder="Facility">
          <option value="">All Facilities</option>
          <option v-for="f in facilities" :key="f.FacilityID" :value="f.FacilityID">
            {{ f.Name }}
          </option>
        </FormSelect>
      </div>
      <button class="px-4 py-2 rounded bg-blue-600 text-white" @click="openForm()">
        Add Vehicle
      </button>
    </div>

    <DataTable :headers="['Facility','Brand','Model','Color','Plate','Serial','Year','Actions']">
      <tr v-for="v in paginatedVehicles" :key="v.ID">
        <td class="px-6 py-2">{{ facilityName(v.FacilityID) }}</td>
        <td class="px-6 py-2">{{ brandName(v.BrandID) }}</td>
        <td class="px-6 py-2">{{ modelName(v.ModelID) }}</td>
        <td class="px-6 py-2">{{ colorName(v.ColorID) }}</td>
        <td class="px-6 py-2">{{ v.PlateNumber }}</td>
        <td class="px-6 py-2">{{ v.SerialNumber }}</td>
        <td class="px-6 py-2">{{ v.ManufacturingYear }}</td>
        <td class="px-6 py-2 text-right">
          <button class="text-indigo-600 mr-2" @click="openForm(v)">Edit</button>
          <button class="text-red-600" @click="deleteVehicle(v.ID)">Delete</button>
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

    <VehicleForm v-model="showForm" :vehicle="selectedVehicle" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import DataTable from '@/components/DataTable.vue'
import FormSelect from '@/components/FormSelect.vue'
import VehicleForm from '@/components/VehicleForm.vue'
import { useVehicleStore } from '@/stores/vehicle'
import { useBrandStore } from '@/stores/brand'
import { useModelStore } from '@/stores/model'
import { useColorStore } from '@/stores/color'
import { useFacilityStore } from '@/stores/facility'
import { useToastStore } from '@/stores/toast'

const vehicleStore = useVehicleStore()
const brandStore = useBrandStore()
const modelStore = useModelStore()
const colorStore = useColorStore()
const facilityStore = useFacilityStore()
const toast = useToastStore()

vehicleStore.fetch()
brandStore.fetch()
modelStore.fetch()
colorStore.fetch()
facilityStore.fetch()

const brandFilter = computed({
  get: () => vehicleStore.brandFilter,
  set: val => vehicleStore.setBrandFilter(val),
})
const modelFilter = computed({
  get: () => vehicleStore.modelFilter,
  set: val => vehicleStore.setModelFilter(val),
})
const colorFilter = computed({
  get: () => vehicleStore.colorFilter,
  set: val => vehicleStore.setColorFilter(val),
})
const facilityFilter = computed({
  get: () => vehicleStore.facilityFilter,
  set: val => vehicleStore.setFacilityFilter(val),
})

const showForm = ref(false)
const selectedVehicle = ref(null)
const page = computed({
  get: () => vehicleStore.page,
  set: val => vehicleStore.setPage(val),
})
const limit = computed(() => vehicleStore.limit)

watch(page, () => vehicleStore.fetch(page.value))

const brands = computed(() => brandStore.items)
const models = computed(() => modelStore.items)
const colors = computed(() => colorStore.items)
const facilities = computed(() => facilityStore.items)

const filteredVehicles = computed(() => {
  let data = vehicleStore.allItems || vehicleStore.items
  if (brandFilter.value) {
    const id = Number(brandFilter.value)
    data = data.filter(v => v.BrandID === id)
  }
  if (modelFilter.value) {
    const id = Number(modelFilter.value)
    data = data.filter(v => v.ModelID === id)
  }
  if (colorFilter.value) {
    const id = Number(colorFilter.value)
    data = data.filter(v => v.ColorID === id)
  }
  if (facilityFilter.value) {
    const id = Number(facilityFilter.value)
    data = data.filter(v => v.FacilityID === id)
  }
  return data
})

const totalPages = computed(() => Math.ceil(vehicleStore.total / limit.value) || 1)

const paginatedVehicles = computed(() => vehicleStore.items)

function brandName(id) {
  const b = brandStore.items.find(b => b.BrandID === id)
  return b ? b.BrandName : ''
}

function modelName(id) {
  const m = modelStore.items.find(m => m.ModelID === id)
  return m ? m.ModelName : ''
}

function colorName(id) {
  const c = colorStore.items.find(c => c.ColorID === id)
  return c ? c.ColorName : ''
}

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

function openForm(vehicle = null) {
  selectedVehicle.value = vehicle
  showForm.value = true
}

async function deleteVehicle(id) {
  try {
    await vehicleStore.remove(id)
    toast.success('Vehicle deleted')
  } catch (err) {
    toast.error('Failed to delete vehicle')
  }
}
</script>

<style scoped>
</style>
