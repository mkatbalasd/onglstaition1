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
    <div v-else class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2" v-show="!showForm">
      <table
        v-if="pagedCards.length"
        class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs sm:text-sm ltr:text-left rtl:text-right"
      >
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
      <EmptyState v-else />
    </div>

    <nav
      v-if="pageCount > 1"
      class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6"
      aria-label="Pagination"
    >
      <div class="flex flex-1 justify-between sm:justify-end">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="relative inline-flex items-center rounded-md px-2 py-2 text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 disabled:opacity-50"
        >
          Prev
        </button>
        <span class="mx-2 text-sm text-gray-700">{{ page }} / {{ pageCount }}</span>
        <button
          @click="nextPage"
          :disabled="page === pageCount"
          class="relative inline-flex items-center rounded-md px-2 py-2 text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </nav>

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
import { useNotificationStore } from '@/stores/notifications'
import EmptyState from '@/components/EmptyState.vue'

const notificationStore = useNotificationStore()

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
const pageCount = ref(1)

async function loadCards() {
  loading.value = true
  try {
    const data = await getDriverCards({
      name: filters.name || undefined,
      identity: filters.identity || undefined,
      facility: filters.facility || undefined,
      supplier: filters.supplier || undefined,
      issueFrom: filters.issueFrom || undefined,
      issueTo: filters.issueTo || undefined,
      expFrom: filters.expFrom || undefined,
      expTo: filters.expTo || undefined,
      page: page.value
    })
    if (data) {
      if (Array.isArray(data)) {
        cards.value = data
        pageCount.value = 1
      } else {
        cards.value = data.items || data.rows || []
        pageCount.value = data.pageCount || 1
      }
      formStore.cards = cards.value
      formStore.page = page.value
      formStore.pageCount = pageCount.value
    }
  } catch (err) {
    notificationStore.pushError('❌ حدث خطأ أثناء التحميل')
  } finally {
    loading.value = false
  }
}

function openNew() {
  formStore.index = -1
  showForm.value = true
}

function openEdit(card) {
  const idx = cards.value.findIndex(c => c.ID === card.ID)
  formStore.index = idx
  showForm.value = true
}

function markSaved() {
  formStore.saved = true
  showForm.value = false
}

const pagedCards = computed(() => cards.value)

function nextPage() {
  if (page.value < pageCount.value) page.value++
}

function prevPage() {
  if (page.value > 1) page.value--
}

watch(
  filters,
  () => {
    page.value = 1
    loadCards()
  },
  { deep: true }
)

watch(page, loadCards)

watch(showForm, val => {
  if (!val && formStore.saved) {
    loadCards()
    formStore.saved = false
  }
})

onMounted(loadCards)
</script>
