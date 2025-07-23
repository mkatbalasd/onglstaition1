<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">Driver Cards</h1>
      <button @click="openNew" class="px-4 py-2 bg-blue-600 text-white rounded">New</button>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <input v-model="filters.name" type="text" placeholder="Name" class="border rounded px-2 py-1 w-full" />
      <input v-model="filters.identity" type="text" placeholder="Identity Number" class="border rounded px-2 py-1 w-full" />
      <input v-model="filters.facility" type="text" placeholder="Facility" class="border rounded px-2 py-1 w-full" />
      <input v-model="filters.supplier" type="text" placeholder="Supplier" class="border rounded px-2 py-1 w-full" />
      <input v-model="filters.issueFrom" type="date" class="border rounded px-2 py-1 w-full" />
      <input v-model="filters.issueTo" type="date" class="border rounded px-2 py-1 w-full" />
      <input v-model="filters.expFrom" type="date" class="border rounded px-2 py-1 w-full" />
      <input v-model="filters.expTo" type="date" class="border rounded px-2 py-1 w-full" />
    </div>

    <Skeleton v-if="loading" :columns="columns.length" v-show="!showForm" />
    <div v-else class="overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg" v-show="!showForm">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs sm:text-sm ltr:text-left rtl:text-right">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-2 py-1 sm:px-3 sm:py-2">#</th>
            <th class="px-2 py-1 sm:px-3 sm:py-2">Card Number</th>
            <th class="px-2 py-1 sm:px-3 sm:py-2">Card Type</th>
            <th class="px-2 py-1 sm:px-3 sm:py-2">Driver</th>
            <th class="px-2 py-1 sm:px-3 sm:py-2">Facility</th>
            <th class="px-2 py-1 sm:px-3 sm:py-2">Issue Date</th>
            <th class="px-2 py-1 sm:px-3 sm:py-2">Expiration Date</th>
            <th class="px-2 py-1 sm:px-3 sm:py-2">Supplier</th>
            <th class="px-2 py-1 sm:px-3 sm:py-2">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="c in pagedCards" :key="c.ID" class="hover:bg-gray-50 dark:hover:bg-gray-900">
            <td class="px-2 py-1 sm:px-3 sm:py-2">{{ c.ID }}</td>
            <td class="px-2 py-1 sm:px-3 sm:py-2">{{ c.CardNumber }}</td>
            <td class="px-2 py-1 sm:px-3 sm:py-2">{{ c.CardType }}</td>
            <td class="px-2 py-1 sm:px-3 sm:py-2">{{ c.FirstName }}</td>
            <td class="px-2 py-1 sm:px-3 sm:py-2">{{ c.Name }}</td>
            <td class="px-2 py-1 sm:px-3 sm:py-2">{{ c.IssueDate }}</td>
            <td class="px-2 py-1 sm:px-3 sm:py-2">{{ c.ExpirationDate }}</td>
            <td class="px-2 py-1 sm:px-3 sm:py-2">{{ c.SupplierName }}</td>
            <td class="px-2 py-1 sm:px-3 sm:py-2 ltr:text-left rtl:text-right">
              <button @click="openEdit(c)" class="text-blue-600 hover:underline">Edit</button>
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

    <DriverCardForm
      v-model="showForm"
      :card="current"
      @saved="markSaved"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch, defineAsyncComponent } from 'vue'
import { useDriverCardFormStore } from '@/stores/driverCardForm'
const DriverCardForm = defineAsyncComponent(() => import('@/components/DriverCardForm.vue'))
import Skeleton from '@/components/Skeleton.vue'
import { getDriverCards } from '@/api/driverCards'

const cards = ref([])
const loading = ref(true)
const showForm = ref(false)
const formStore = useDriverCardFormStore()
const current = computed(() => formStore.currentCard)
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

const filters = reactive({
  name: '',
  identity: '',
  facility: '',
  supplier: '',
  issueFrom: '',
  issueTo: '',
  expFrom: '',
  expTo: ''
})

const page = ref(1)
const pageSize = 10

async function loadCards() {
  loading.value = true
  const data = await getDriverCards()
  if (data) cards.value = data
  formStore.cards = cards.value
  loading.value = false
}

function openNew() {
  formStore.index = -1
  showForm.value = true
}

function openEdit(card) {
  const idx = filteredCards.value.findIndex(c => c.ID === card.ID)
  formStore.index = idx
  showForm.value = true
}

function markSaved() {
  formStore.saved = true
  showForm.value = false
}

const filteredCards = computed(() =>
  cards.value.filter(c => {
    if (filters.name && !String(c.FirstName).toLowerCase().includes(filters.name.toLowerCase())) return false
    if (filters.identity && !String(c.DriverIdentity || '').toLowerCase().includes(filters.identity.toLowerCase())) return false
    if (filters.facility && !String(c.Name).toLowerCase().includes(filters.facility.toLowerCase())) return false
    if (filters.supplier && !String(c.SupplierName || '').toLowerCase().includes(filters.supplier.toLowerCase())) return false
    if (filters.issueFrom && c.IssueDate < filters.issueFrom) return false
    if (filters.issueTo && c.IssueDate > filters.issueTo) return false
    if (filters.expFrom && c.ExpirationDate < filters.expFrom) return false
    if (filters.expTo && c.ExpirationDate > filters.expTo) return false
    return true
  })
)

const pageCount = computed(() => Math.ceil(filteredCards.value.length / pageSize))
const pagedCards = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredCards.value.slice(start, start + pageSize)
})

function nextPage() {
  if (page.value < pageCount.value) page.value++
}

function prevPage() {
  if (page.value > 1) page.value--
}

watch(filteredCards, () => { page.value = 1 })
watch(filteredCards, cardsList => { formStore.cards = cardsList })
watch(showForm, val => {
  if (!val && formStore.saved) {
    loadCards()
    formStore.saved = false
  }
})

onMounted(loadCards)
</script>
