<template>
  <div class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
    <table
      v-if="items.length"
      class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs sm:text-sm ltr:text-left rtl:text-right"
    >
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-3 py-2 sm:px-4 sm:py-3 ltr:text-left rtl:text-right"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr
          v-for="(item, idx) in items"
          :key="idx"
          class="hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-3 py-2 sm:px-4 sm:py-3 ltr:text-left rtl:text-right"
          >
            {{ item[col.key] }}
          </td>
        </tr>
      </tbody>
    </table>
    <EmptyState v-else />
  </div>
</template>

<script setup>
import EmptyState from './EmptyState.vue'
const props = defineProps({
  items: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] }
})
</script>
