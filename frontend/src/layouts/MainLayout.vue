<template>
  <div class="min-h-screen flex">
    <Sidebar class="w-64" />
    <div class="flex-1 flex flex-col">
      <Header />
      <main class="flex-1 p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
</script>

<style scoped>
</style>
