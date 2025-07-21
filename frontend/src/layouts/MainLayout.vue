<template>
  <div>
    <header class="bg-white shadow fixed top-0 inset-x-0 z-10">
      <nav class="container mx-auto flex flex-wrap items-center justify-between p-4">
        <RouterLink to="/" class="font-bold text-blue-600">الرئيسية</RouterLink>
        <ul class="flex space-x-4 rtl:space-x-reverse">
          <li><RouterLink class="text-gray-700 hover:text-blue-600" to="/driver-cards">قائمة بطاقات السائقين</RouterLink></li>
          <li><RouterLink class="text-gray-700 hover:text-blue-600" to="/cards">كروت التشغيل</RouterLink></li>
          <li><RouterLink class="text-gray-700 hover:text-blue-600" to="/facilities">المنشآت</RouterLink></li>
          <li><RouterLink class="text-gray-700 hover:text-blue-600" to="/drivers">السائقون</RouterLink></li>
          <li><RouterLink class="text-gray-700 hover:text-blue-600" to="/vehicles">المركبات</RouterLink></li>
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
