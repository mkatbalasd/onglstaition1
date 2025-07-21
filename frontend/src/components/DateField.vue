<template>
  <div>
    <label v-if="label" class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300 ltr:text-left rtl:text-right">{{ label }}</label>
    <DatePicker
      v-model="innerValue"
      :initial-type="initialType"
      :language="language"
      class="w-full dark:bg-gray-800 dark:border-gray-700"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import DatePicker from 'vue3-hijri-gregorian-datepicker'
import 'vue3-hijri-gregorian-datepicker/dist/style.css'

const props = defineProps({
  modelValue: { type: Object, default: () => ({ date: '', type: 'hijri' }) },
  label: String,
  initialType: { type: String, default: 'hijri' },
  language: { type: String, default: 'ar' }
})

const emit = defineEmits(['update:modelValue'])
const innerValue = ref({ ...props.modelValue })

watch(() => props.modelValue, val => {
  innerValue.value = { ...val }
})

watch(innerValue, val => {
  emit('update:modelValue', val)
})
</script>
