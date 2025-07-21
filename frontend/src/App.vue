<script setup>
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <div class="min-h-screen flex">
    <Sidebar class="w-64" />
    <div class="flex-1 flex flex-col">
      <Header />
      <main class="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
</style>
