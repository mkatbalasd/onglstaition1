<template>
  <div class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-right text-xs sm:text-sm">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th v-for="n in columns" :key="n" class="px-2 py-1 sm:px-3 sm:py-2">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700 animate-pulse">
        <tr v-for="r in rows" :key="r" class="hover:bg-gray-50 dark:hover:bg-gray-900">
          <td v-for="c in columns" :key="c" class="px-2 py-1 sm:px-3 sm:py-2">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  columns: { type: Number, default: 3 },
  rows: { type: Number, default: 5 }
})
</script>
