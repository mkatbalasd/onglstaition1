<template>
  <CrudList :store="store" id-key="LicenseTypeID" name-key="Name" item-label="License Type" />
</template>

<script setup>
import CrudList from '@/components/CrudList.vue'
import { useLicenseTypeStore } from '@/stores/licenseType'

const store = useLicenseTypeStore()
</script>

<style scoped>
</style>
