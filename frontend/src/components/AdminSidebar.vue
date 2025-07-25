<template>
  <aside
    class="bg-gray-800 text-white w-60 fixed inset-y-0 transform lg:translate-x-0 transition-transform rtl:translate-x-full"
    :class="open ? 'translate-x-0 rtl:-translate-x-0' : '-translate-x-full rtl:translate-x-full'"
  >
    <div class="p-4 font-bold border-b border-gray-700">Menu</div>
    <nav class="mt-4 space-y-1">
      <RouterLink
        v-for="item in menu"
        :key="item.to"
        :to="item.to"
        class="block px-4 py-2 hover:bg-gray-700"
        @click="$emit('close')"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  open: Boolean,
  menu: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
</style>
