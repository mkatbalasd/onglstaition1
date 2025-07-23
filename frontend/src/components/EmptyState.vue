<template>
  <div class="p-6 text-center text-gray-500 dark:text-gray-400">
    {{ message }}
  </div>
</template>

<script setup>
const props = defineProps({
  message: { type: String, default: 'No records found.' }
})
</script>
