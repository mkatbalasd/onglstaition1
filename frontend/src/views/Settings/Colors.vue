<template>
  <CrudList :store="store" id-key="ColorID" name-key="ColorName" item-label="Color" />
</template>

<script setup>
import CrudList from '@/components/CrudList.vue'
import { useColorStore } from '@/stores/color'

const store = useColorStore()
</script>

<style scoped>
</style>
