<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow p-4 flex items-start space-x-3 rtl:space-x-reverse"
  >
    <component v-if="icon" :is="icon" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
    <div class="flex-1">
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: { type: [Object, Function], default: null }
})
</script>

<style scoped>
</style>
