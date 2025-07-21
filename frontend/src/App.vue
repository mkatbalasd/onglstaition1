<template>
  <div class="min-h-screen flex font-sans">
    <Sidebar class="hidden md:block w-64 shrink-0" />
    <div class="flex-1 flex flex-col">
      <Header />
      <main class="flex-1 p-4 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
</script>
