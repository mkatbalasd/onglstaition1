<template>
  <div>
    <div class="flex justify-end mb-4">
      <button class="px-4 py-2 rounded bg-blue-600 text-white" @click="openForm()">
        Add Card
      </button>
    </div>

    <DataTable :headers="['Card Number','Facility','Vehicle','Driver','Issue Date','Expiration','Actions']">
      <tr v-for="c in cardStore.items" :key="c.ID">
        <td class="px-6 py-2">{{ c.CardNumber }}</td>
        <td class="px-6 py-2">{{ facilityName(c.FacilityID) }}</td>
        <td class="px-6 py-2">{{ vehicleName(c.VehicleID) }}</td>
        <td class="px-6 py-2">{{ driverName(c.DriverID) }}</td>
        <td class="px-6 py-2">{{ c.IssueDate }}</td>
        <td class="px-6 py-2">{{ c.ExpirationDate }}</td>
        <td class="px-6 py-2 text-right">
          <button class="text-indigo-600 mr-2" @click="openForm(c)">Edit</button>
          <button class="text-red-600" @click="deleteCard(c.ID)">Delete</button>
        </td>
      </tr>
    </DataTable>

    <CardForm v-model="showForm" :card="selectedCard" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from '@/components/DataTable.vue'
import CardForm from '@/components/CardForm.vue'
import { useCardStore } from '@/stores/card'
import { useFacilityStore } from '@/stores/facility'
import { useVehicleStore } from '@/stores/vehicle'
import { useDriverStore } from '@/stores/driver'
import { useNotificationStore } from '@/stores/notification'

const cardStore = useCardStore()
const facilityStore = useFacilityStore()
const vehicleStore = useVehicleStore()
const driverStore = useDriverStore()
const notify = useNotificationStore()

cardStore.fetch()
facilityStore.fetch()
vehicleStore.fetch()
driverStore.fetch()

const showForm = ref(false)
const selectedCard = ref(null)

function facilityName(id) {
  const f = facilityStore.items.find(f => f.FacilityID === id)
  return f ? f.Name : ''
}

function vehicleName(id) {
  const v = vehicleStore.items.find(v => v.ID === id)
  return v ? v.PlateNumber : ''
}

function driverName(id) {
  const d = driverStore.items.find(d => d.DriverID === id)
  return d ? d.FirstName + ' ' + d.LastName : ''
}

function openForm(card = null) {
  selectedCard.value = card
  showForm.value = true
}

async function deleteCard(id) {
  try {
    await cardStore.remove(id)
    notify.success('Card deleted')
  } catch {
    notify.error('Failed to delete')
  }
}
</script>

<style scoped>
</style>
