<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">Driver Cards</h1>
    <div class="overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-right">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-3 py-2">#</th>
            <th class="px-3 py-2">Card Number</th>
            <th class="px-3 py-2">Driver</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="n in 5" :key="n" class="hover:bg-gray-50 dark:hover:bg-gray-900">
            <td class="px-3 py-2">{{ n }}</td>
            <td class="px-3 py-2">--</td>
            <td class="px-3 py-2">--</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
</script>
