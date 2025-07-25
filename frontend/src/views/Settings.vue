<template>
  <div class="space-y-2">
    <RouterLink class="text-blue-600 block" to="/settings/brands">Brands</RouterLink>
    <RouterLink class="text-blue-600 block" to="/settings/models">Models</RouterLink>
    <RouterLink class="text-blue-600 block" to="/settings/colors">Colors</RouterLink>
    <RouterLink class="text-blue-600 block" to="/settings/license-types">License Types</RouterLink>
    <RouterLink class="text-blue-600 block" to="/settings/suppliers">Suppliers</RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
</style>
