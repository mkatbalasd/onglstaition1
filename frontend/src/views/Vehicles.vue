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

    <div class="flex justify-between items-center mt-4">
      <button class="px-3 py-1" :disabled="page === 1" @click="page--">Prev</button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button class="px-3 py-1" :disabled="page >= totalPages" @click="page++">Next</button>
    </div>

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

const brandFilter = ref('')
const modelFilter = ref('')
const colorFilter = ref('')
const facilityFilter = ref('')

const showForm = ref(false)
const selectedVehicle = ref(null)
const page = ref(1)
const limit = ref(vehicleStore.limit)

watch([brandFilter, modelFilter, colorFilter, facilityFilter], () => {
  page.value = 1
})

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

const totalPages = computed(() => Math.ceil(filteredVehicles.value.length / limit.value) || 1)

const paginatedVehicles = computed(() => {
  const start = (page.value - 1) * limit.value
  return filteredVehicles.value.slice(start, start + limit.value)
})

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
