<template>
  <div>
    <Listbox v-model="innerValue" as="div" class="w-full">
      <ListboxLabel v-if="label" class="block text-sm font-medium mb-1">{{ label }}</ListboxLabel>
      <div class="relative">
        <ListboxButton class="relative w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700 py-2 pl-3 pr-10 text-left">
          <span class="block truncate">{{ selectedLabel || placeholder }}</span>
        </ListboxButton>
        <TransitionRoot leave="transition ease-in duration-100" leave-from="opacity-100" leave-to="opacity-0" as="template">
          <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <ListboxOption v-for="opt in options" :key="opt.value" :value="opt.value" v-slot="{ active, selected }" class="relative cursor-default select-none py-2 pl-4 pr-4">
              <span :class="selected ? 'font-semibold' : 'font-normal'" class="block truncate">{{ opt.label }}</span>
            </ListboxOption>
          </ListboxOptions>
        </TransitionRoot>
      </div>
    </Listbox>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions, TransitionRoot } from '@headlessui/vue'

const props = defineProps({
  modelValue: [String, Number],
  options: { type: Array, default: () => [] },
  label: String,
  placeholder: { type: String, default: 'Select...' }
})

const emit = defineEmits(['update:modelValue'])
const innerValue = ref(props.modelValue)

watch(() => props.modelValue, val => { innerValue.value = val })
watch(innerValue, val => emit('update:modelValue', val))

const selectedLabel = computed(() => {
  const opt = props.options.find(o => o.value === innerValue.value)
  return opt ? opt.label : ''
})
</script>
