<template>
  <CrudList :store="store" id-key="ModelID" name-key="ModelName" item-label="Model" />
</template>

<script setup>
import CrudList from '@/components/CrudList.vue'
import { useModelStore } from '@/stores/model'

const store = useModelStore()
</script>

<style scoped>
</style>
