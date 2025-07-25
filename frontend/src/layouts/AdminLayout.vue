<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AdminHeader from '@/components/AdminHeader.vue'
import AdminSidebar from '@/components/AdminSidebar.vue'

const sidebarOpen = ref(false)

const menu = [
  { label: 'Dashboard', to: '/' },
]
</script>

<template>
  <div class="flex rtl:flex-row-reverse">
    <AdminSidebar :open="sidebarOpen" :menu="menu" @close="sidebarOpen = false" />
    <div class="flex-1 min-h-screen bg-gray-50 dark:bg-slate-900" :class="sidebarOpen ? 'pl-60 rtl:pl-0 rtl:pr-60' : ''">
      <AdminHeader @toggle="sidebarOpen = !sidebarOpen" />
      <main class="pt-16 p-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
</style>
