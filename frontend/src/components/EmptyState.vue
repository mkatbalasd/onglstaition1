<template>
  <div class="p-6 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center space-y-2">
    <Inbox class="w-12 h-12" />
    <span>{{ message }}</span>
  </div>
</template>

<script setup>
import { Inbox } from 'lucide-vue-next'
const props = defineProps({
  message: { type: String, default: 'No records found.' }
})
</script>
