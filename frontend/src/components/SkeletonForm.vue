<template>
  <div class="space-y-4 animate-pulse">
    <div v-for="n in fields" :key="n" class="space-y-2">
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
    <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-auto"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  fields: { type: Number, default: 4 }
})
</script>
