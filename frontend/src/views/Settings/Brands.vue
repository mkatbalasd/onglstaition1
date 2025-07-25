<template>
  <CrudList :store="store" id-key="BrandID" name-key="BrandName" item-label="Brand" />
</template>

<script setup>
import CrudList from '@/components/CrudList.vue'
import { useBrandStore } from '@/stores/brand'

const store = useBrandStore()
</script>

<style scoped>
</style>
