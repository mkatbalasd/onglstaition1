<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">Driver Cards</h1>
    <div v-if="loading" class="space-y-2 animate-pulse">
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
    <div v-else class="space-y-4">
      <input v-model="search" type="text" placeholder="Search" class="border rounded px-2 py-1" />
      <VueTableLite
        :columns="table.columns"
        :rows="filteredRows"
        :total="filteredRows.length"
        :page-size="5"
        :is-static-mode="true"
        :is-slot-mode="true"
      >
        <template #actions="{ value }">
          <RouterLink :to="`/driver-cards/${value.ID}/edit`" class="text-blue-600 hover:underline mr-2">Edit</RouterLink>
          <RouterLink :to="`/driver-cards/${value.ID}/delete`" class="text-red-600 hover:underline">Delete</RouterLink>
        </template>
      </VueTableLite>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { RouterLink } from 'vue-router'
import VueTableLite from 'vue3-table-lite'

const table = reactive({
  columns: [
    { label: '#', field: 'ID', width: '5%', sortable: true, isKey: true },
    { label: 'Card Number', field: 'CardNumber', sortable: true },
    { label: 'Card Type', field: 'CardType' },
    { label: 'Driver', field: 'FirstName' },
    { label: 'Facility', field: 'Name' },
    { label: 'Issue Date', field: 'IssueDate' },
    { label: 'Expiration Date', field: 'ExpirationDate' },
    { label: 'Supplier', field: 'SupplierName' },
    { label: 'Actions', field: 'actions' }
  ],
  rows: []
})
const loading = ref(true)
const search = ref('')

const filteredRows = computed(() => {
  if (!search.value) return table.rows
  const term = search.value.toLowerCase()
  return table.rows.filter(r =>
    Object.values(r).some(v => String(v).toLowerCase().includes(term))
  )
})

async function loadCards() {
  loading.value = true
  const res = await fetch('/nagl/api/driver-cards')
  table.rows = await res.json()
  loading.value = false
}

onMounted(loadCards)
</script>

