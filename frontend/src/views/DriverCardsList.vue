<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">Driver Cards</h1>
    <div v-if="loading" class="space-y-2 animate-pulse">
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
    <div v-else class="space-y-4">
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <input v-model="facility" type="text" placeholder="Facility" class="border rounded px-2 py-1 w-full" />
        <input v-model="identity" type="text" placeholder="Driver Identity" class="border rounded px-2 py-1 w-full" />
        <input v-model="supplier" type="text" placeholder="Supplier" class="border rounded px-2 py-1 w-full" />
        <input v-model="dateFrom" type="date" class="border rounded px-2 py-1 w-full" />
        <input v-model="dateTo" type="date" class="border rounded px-2 py-1 w-full" />
      </div>
      <div class="overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg">
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
            <tr v-for="row in pagedRows" :key="row.ID" class="hover:bg-gray-50 dark:hover:bg-gray-900">
              <td class="px-3 py-2">{{ row.ID }}</td>
              <td class="px-3 py-2">{{ row.CardNumber }}</td>
              <td class="px-3 py-2">{{ row.CardType }}</td>
              <td class="px-3 py-2">{{ row.FirstName }}</td>
              <td class="px-3 py-2">{{ row.Name }}</td>
              <td class="px-3 py-2">{{ row.IssueDate }}</td>
              <td class="px-3 py-2">{{ row.ExpirationDate }}</td>
              <td class="px-3 py-2">{{ row.SupplierName }}</td>
              <td class="px-3 py-2">
                <RouterLink :to="`/driver-cards/${row.ID}/edit`" class="text-blue-600 hover:underline mr-2">Edit</RouterLink>
                <RouterLink :to="`/driver-cards/${row.ID}/delete`" class="text-red-600 hover:underline">Delete</RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-center items-center space-x-2 rtl:space-x-reverse" v-if="pageCount > 1">
        <button @click="prevPage" :disabled="page === 1" class="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
        <span>{{ page }} / {{ pageCount }}</span>
        <button @click="nextPage" :disabled="page === pageCount" class="px-2 py-1 border rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { getDriverCards } from '@/api/driverCards'
import { useNotificationStore } from '@/stores/notifications'

const rows = ref([])
const loading = ref(true)
const notificationStore = useNotificationStore()

const facility = ref('')
const identity = ref('')
const supplier = ref('')
const dateFrom = ref('')
const dateTo = ref('')

const page = ref(1)
const pageSize = 10

const filteredRows = computed(() =>
  rows.value.filter(r => {
    if (facility.value && !r.Name.toLowerCase().includes(facility.value.toLowerCase())) return false
    if (identity.value && !(r.DriverIdentity || '').toLowerCase().includes(identity.value.toLowerCase())) return false
    if (supplier.value && !(r.SupplierName || '').toLowerCase().includes(supplier.value.toLowerCase())) return false
    if (dateFrom.value && r.IssueDate < dateFrom.value) return false
    if (dateTo.value && r.IssueDate > dateTo.value) return false
    return true
  })
)

const pageCount = computed(() => Math.ceil(filteredRows.value.length / pageSize))
const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredRows.value.slice(start, start + pageSize)
})

function nextPage() {
  if (page.value < pageCount.value) page.value++
}

function prevPage() {
  if (page.value > 1) page.value--
}

watch(filteredRows, () => { page.value = 1 })

async function loadCards() {
  loading.value = true
  try {
    const data = await getDriverCards()
    if (data) rows.value = data
  } catch (err) {
    notificationStore.pushError('❌ حدث خطأ أثناء التحميل')
  } finally {
    loading.value = false
  }
}

onMounted(loadCards)
</script>

