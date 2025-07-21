<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans">
    <header class="bg-white dark:bg-gray-800 shadow fixed top-0 inset-x-0 z-10">
      <nav class="container mx-auto flex flex-wrap items-center justify-between p-4 rtl:flex-row-reverse">
        <RouterLink to="/" class="font-bold text-blue-600 dark:text-blue-400">الرئيسية</RouterLink>
        <ul class="flex space-x-4 rtl:space-x-reverse">
          <li><RouterLink class="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400" to="/driver-cards">قائمة بطاقات السائقين</RouterLink></li>
          <li><RouterLink class="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400" to="/cards">كروت التشغيل</RouterLink></li>
          <li><RouterLink class="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400" to="/facilities">المنشآت</RouterLink></li>
          <li><RouterLink class="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400" to="/drivers">السائقون</RouterLink></li>
          <li><RouterLink class="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400" to="/vehicles">المركبات</RouterLink></li>
        </ul>
      </nav>
    </header>
    <main class="container mx-auto pt-20 p-4">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
</style>
