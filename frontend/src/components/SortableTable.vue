<template>
  <div class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
    <table
      v-if="sortedItems.length"
      class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs sm:text-sm ltr:text-left rtl:text-right"
    >
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            @click="sortBy(col.key)"
            class="px-3 py-2 sm:px-4 sm:py-3 cursor-pointer select-none ltr:text-left rtl:text-right"
          >
            {{ col.label }}
            <span v-if="sort.key === col.key">{{ sort.asc ? '▲' : '▼' }}</span>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr
          v-for="(item, idx) in sortedItems"
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
import { ref, computed } from 'vue'
import EmptyState from './EmptyState.vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] }
})

const sort = ref({ key: '', asc: true })

function sortBy(key) {
  if (sort.value.key === key) {
    sort.value.asc = !sort.value.asc
  } else {
    sort.value.key = key
    sort.value.asc = true
  }
}

const sortedItems = computed(() => {
  if (!sort.value.key) return props.items
  return [...props.items].sort((a, b) => {
    const av = a[sort.value.key]
    const bv = b[sort.value.key]
    if (av === bv) return 0
    if (sort.value.asc) return av > bv ? 1 : -1
    return av < bv ? 1 : -1
  })
})
</script>
