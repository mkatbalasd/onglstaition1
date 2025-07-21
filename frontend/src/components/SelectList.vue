<template>
  <div>
    <label v-if="label" class="block text-sm font-medium mb-1">{{ label }}</label>
    <select v-model="innerValue" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700">
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  options: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])
const innerValue = ref(props.modelValue)

watch(() => props.modelValue, val => {
  innerValue.value = val
})

watch(innerValue, val => emit('update:modelValue', val))
</script>
