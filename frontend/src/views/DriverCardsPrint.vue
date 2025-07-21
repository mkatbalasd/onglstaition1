<template>
  <div class="p-4 text-center text-gray-600 dark:text-gray-400">جاري التحضير للطباعة...</div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const token = route.params.token
  if (token) {
    window.open(`https://s.mnaseb.com/h/OPcard/driver.php?token=${token}`, '_blank')
  }
  router.replace('/driver-cards')
})
</script>
