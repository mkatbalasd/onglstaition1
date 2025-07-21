<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">Driver Cards</h1>
      <button @click="openNew" class="px-4 py-2 bg-blue-600 text-white rounded">New</button>
    </div>
    <SkeletonTable v-if="loading" :columns="columns.length" />
    <div v-else class="overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-right">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-3 py-2">#</th>
            <th class="px-3 py-2">Card Number</th>
            <th class="px-3 py-2">Card Type</th>
            <th class="px-3 py-2">Driver</th>
            <th class="px-3 py-2">Facility</th>
            <th class="px-3 py-2">Issue Date</th>
            <th class="px-3 py-2">Expiration Date</th>
            <th class="px-3 py-2">Supplier</th>
            <th class="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="c in cards" :key="c.ID" class="hover:bg-gray-50 dark:hover:bg-gray-900">
            <td class="px-3 py-2">{{ c.ID }}</td>
            <td class="px-3 py-2">{{ c.CardNumber }}</td>
            <td class="px-3 py-2">{{ c.CardType }}</td>
            <td class="px-3 py-2">{{ c.FirstName }}</td>
            <td class="px-3 py-2">{{ c.Name }}</td>
            <td class="px-3 py-2">{{ c.IssueDate }}</td>
            <td class="px-3 py-2">{{ c.ExpirationDate }}</td>
            <td class="px-3 py-2">{{ c.SupplierName }}</td>
            <td class="px-3 py-2 text-left">
              <button @click="openEdit(c)" class="text-blue-600 hover:underline">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <DriverCardForm v-model="showForm" :card="current" @saved="loadCards" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DriverCardForm from '@/components/DriverCardForm.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'

const cards = ref([])
const loading = ref(true)
const showForm = ref(false)
const current = ref(null)
const columns = [
  '#',
  'Card Number',
  'Card Type',
  'Driver',
  'Facility',
  'Issue Date',
  'Expiration Date',
  'Supplier',
  'Actions'
]

async function loadCards() {
  loading.value = true
  const res = await fetch('/nagl/api/driver-cards')
  cards.value = await res.json()
  loading.value = false
}

function openNew() {
  current.value = null
  showForm.value = true
}

function openEdit(card) {
  current.value = card
  showForm.value = true
}

onMounted(loadCards)
</script>
