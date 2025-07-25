<template>
  <header class="bg-white shadow fixed top-0 inset-x-0 z-10 dark:bg-slate-800">
    <div class="flex items-center justify-between p-4">
      <button class="lg:hidden" @click="$emit('toggle')">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5M3.75 12h16.5m-16.5 6.75h16.5" />
        </svg>
      </button>
      <h1 class="font-bold">Admin One</h1>
    </div>
  </header>
</template>

<script setup>
defineEmits(['toggle'])
</script>

<style scoped>
</style>
