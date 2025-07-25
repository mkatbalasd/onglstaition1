<template>
  <div>
    <div class="flex justify-end mb-4">
      <button @click="showModal = true" class="px-4 py-2 rounded bg-blue-600 text-white">
        إضافة بطاقة سائق
      </button>
    </div>
    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left rtl:text-right">السائق</th>
            <th class="px-4 py-2 text-left rtl:text-right">رقم البطاقة</th>
            <th class="px-4 py-2 text-left rtl:text-right">انتهاء الصلاحية</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="card in cards" :key="card.id" class="border-b">
            <td class="px-4 py-2">{{ card.driver }}</td>
            <td class="px-4 py-2">{{ card.number }}</td>
            <td class="px-4 py-2">{{ card.expiration }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <Modal v-model="showModal" title="بطاقة سائق">
      <p class="py-4 text-center">سيتم إضافة النموذج لاحقاً</p>
      <div class="text-right">
        <button @click="showModal = false" class="px-4 py-2 rounded bg-gray-200">إغلاق</button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Modal from '@/components/Modal.vue'

const showModal = ref(false)
const cards = ref([
  { id: 1, driver: 'أحمد', number: '12345', expiration: '2025-12-31' },
])
</script>

<style scoped>
</style>
