<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">Operating Cards</h1>
      <button @click="openNew" class="px-4 py-2 bg-blue-600 text-white rounded">New</button>
    </div>
    <div v-if="loading" class="space-y-2 animate-pulse">
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
    <div v-else class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2">
      <table
        v-if="cards.length"
        class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-right"
      >
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-3 py-2">#</th>
            <th class="px-3 py-2">Card Number</th>
            <th class="px-3 py-2">Vehicle</th>
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
            <td class="px-3 py-2">{{ c.PlateNumber }}</td>
            <td class="px-3 py-2">{{ c.Name }}</td>
            <td class="px-3 py-2">{{ c.IssueDate }}</td>
            <td class="px-3 py-2">{{ c.ExpirationDate }}</td>
            <td class="px-3 py-2">{{ c.SupplierName }}</td>
            <td class="px-3 py-2 text-left space-x-2 rtl:space-x-reverse">
              <button @click="openEdit(c)" class="text-blue-600 hover:underline">Edit</button>
              <button @click="remove(c)" class="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <EmptyState v-else />
    </div>
    <CardForm v-model="showForm" :card="current" @saved="loadCards" />
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
const CardForm = defineAsyncComponent(() => import('./CardForm.vue'))
import { useDataStore } from '@/stores/data'
import api from '@/services/axios'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/notifications'
import EmptyState from '@/components/EmptyState.vue'

const store = useDataStore()
const { cards } = storeToRefs(store)
const loading = ref(true)
const showForm = ref(false)
const current = ref(null)
const notificationStore = useNotificationStore()

async function loadCards() {
  loading.value = true
  try {
    await store.fetchCards()
  } catch (err) {
    notificationStore.pushError('❌ حدث خطأ أثناء التحميل')
  } finally {
    loading.value = false
  }
}

function openNew() {
  current.value = null
  showForm.value = true
}

function openEdit(card) {
  current.value = card
  showForm.value = true
}

async function remove(card) {
  if (confirm('حذف؟')) {
    try {
      await api.delete(`/cards/${card.ID}`)
      loadCards()
    } catch (err) {
      notificationStore.pushError('❌ حدث خطأ أثناء الحذف')
    }
  }
}

onMounted(loadCards)
</script>
