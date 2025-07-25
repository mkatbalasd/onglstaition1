<template>
  <CrudList :store="store" id-key="SupplierID" name-key="Name" item-label="Supplier" />
</template>

<script setup>
import CrudList from '@/components/CrudList.vue'
import { useSupplierStore } from '@/stores/supplier'

const store = useSupplierStore()
</script>

<style scoped>
</style>
