<template>
  <div>
    <div class="flex flex-wrap gap-2 mb-4 justify-between">
      <div class="flex flex-wrap gap-2">
        <FormInput v-model="search" placeholder="Search..." />
        <FormSelect v-model="typeFilter" placeholder="Type">
          <option value="">All Types</option>
          <option value="temporary">Temporary</option>
          <option value="permanent">Permanent</option>
        </FormSelect>
        <FormSelect v-model="facilityFilter" placeholder="Facility">
          <option value="">All Facilities</option>
          <option v-for="f in facilities" :key="f.FacilityID" :value="f.FacilityID">
            {{ f.Name }}
          </option>
        </FormSelect>
        <FormSelect v-model="supplierFilter" placeholder="Supplier">
          <option value="">All Suppliers</option>
          <option v-for="s in suppliers" :key="s.SupplierID" :value="s.SupplierID">
            {{ s.Name }}
          </option>
        </FormSelect>
        <input type="date" v-model="dateFrom" class="border rounded px-2" />
        <input type="date" v-model="dateTo" class="border rounded px-2" />
      </div>
      <button class="px-4 py-2 rounded bg-blue-600 text-white" @click="openForm()">
        Add Card
      </button>
    </div>

    <DataTable :headers="['Card Number','Driver','Facility','Type','Issue Date','Expiration','Actions']">
      <tr v-for="c in filteredCards" :key="c.ID">
        <td class="px-6 py-2">{{ c.CardNumber }}</td>
        <td class="px-6 py-2">{{ driverName(c.DriverID) }}</td>
        <td class="px-6 py-2">{{ facilityName(c.FacilityID) }}</td>
        <td class="px-6 py-2">{{ c.CardType }}</td>
        <td class="px-6 py-2">{{ c.IssueDate }}</td>
        <td class="px-6 py-2">{{ c.ExpirationDate }}</td>
        <td class="px-6 py-2 text-right">
          <button class="text-indigo-600 mr-2" @click="openForm(c)">Edit</button>
          <button class="text-red-600" @click="deleteCard(c.ID)">Delete</button>
        </td>
      </tr>
    </DataTable>

    <DriverCardForm v-model="showForm" :card="selectedCard" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DataTable from '@/components/DataTable.vue'
import FormInput from '@/components/FormInput.vue'
import FormSelect from '@/components/FormSelect.vue'
import DriverCardForm from '@/components/DriverCardForm.vue'
import { useDriverCardStore } from '@/stores/driverCard'
import { useDriverStore } from '@/stores/driver'
import { useFacilityStore } from '@/stores/facility'
import { useSupplierStore } from '@/stores/supplier'
import { useToastStore } from '@/stores/toast'

const driverCardStore = useDriverCardStore()
const driverStore = useDriverStore()
const facilityStore = useFacilityStore()
const supplierStore = useSupplierStore()
const toast = useToastStore()

driverCardStore.fetch()
driverStore.fetch()
facilityStore.fetch()
supplierStore.fetch()

const search = ref('')
const typeFilter = ref('')
const facilityFilter = ref('')
const supplierFilter = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const showForm = ref(false)
const selectedCard = ref(null)

const facilities = computed(() => facilityStore.items)
const suppliers = computed(() => supplierStore.items)

const filteredCards = computed(() => {
  let data = driverCardStore.items
  if (search.value) {
    const s = search.value.toLowerCase()
    data = data.filter(c => String(c.CardNumber).includes(s))
  }
  if (typeFilter.value) data = data.filter(c => c.CardType === typeFilter.value)
  if (facilityFilter.value) data = data.filter(c => c.FacilityID === Number(facilityFilter.value))
  if (supplierFilter.value) data = data.filter(c => c.Supplier === Number(supplierFilter.value))
  if (dateFrom.value) data = data.filter(c => new Date(c.IssueDate) >= new Date(dateFrom.value))
  if (dateTo.value) data = data.filter(c => new Date(c.IssueDate) <= new Date(dateTo.value))
  return data
})

function driverName(id) {
  const d = driverStore.items.find(dr => dr.DriverID === id)
  return d ? d.FirstName + ' ' + d.LastName : ''
}
function facilityName(id) {
  const f = facilityStore.items.find(fc => fc.FacilityID === id)
  return f ? f.Name : ''
}

function openForm(card = null) {
  selectedCard.value = card
  showForm.value = true
}

async function deleteCard(id) {
  try {
    await driverCardStore.remove(id)
    toast.success('Card deleted')
  } catch {
    toast.error('Failed to delete')
  }
}
</script>

<style scoped>
</style>
