<template>
  <header
    class="bg-blue-50 dark:bg-gray-900 shadow p-4 flex justify-between items-center rtl:flex-row-reverse font-sans"
  >
    <h1 class="text-xl font-semibold text-gray-800 dark:text-gray-100">My App</h1>
    <nav class="flex space-x-4 rtl:space-x-reverse">
      <button
        class="p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400"
        @click="toggleDark"
      >
        <component :is="dark ? Sun : Moon" class="w-5 h-5" />
      </button>
      <button
        class="p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400"
        @click="toggleDir"
      >
        {{ dir === 'ltr' ? 'RTL' : 'LTR' }}
      </button>
      <button
        class="p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400"
      >
        <Bell class="w-5 h-5" />
      </button>
      <Menu as="div" class="relative">
        <MenuButton class="p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400">
          <User class="w-5 h-5" />
        </MenuButton>
        <TransitionRoot
          enter="transition ease-out duration-100"
          enter-from="transform opacity-0 scale-95"
          enter-to="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leave-from="transform opacity-100 scale-100"
          leave-to="transform opacity-0 scale-95"
        >
          <MenuItems class="absolute end-0 mt-2 w-40 origin-top-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow focus:outline-none">
            <MenuItem v-slot="{ active }">
              <a
                href="#"
                :class="[
                  'block px-4 py-2 text-sm text-gray-700 dark:text-gray-100',
                  active ? 'bg-gray-100 dark:bg-gray-900' : ''
                ]"
              >
                Profile
              </a>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <a
                href="#"
                :class="[
                  'block px-4 py-2 text-sm text-gray-700 dark:text-gray-100',
                  active ? 'bg-gray-100 dark:bg-gray-900' : ''
                ]"
              >
                Logout
              </a>
            </MenuItem>
          </MenuItems>
        </TransitionRoot>
      </Menu>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Bell, User, Sun, Moon } from 'lucide-vue-next'
import { Menu, MenuButton, MenuItems, MenuItem, TransitionRoot } from '@headlessui/vue'

const dark = ref(false)
const dir = ref('ltr')

function toggleDark() {
  window.toggleDark()
  dark.value = document.documentElement.classList.contains('dark')
}

function toggleDir() {
  window.toggleDir()
  dir.value = document.documentElement.getAttribute('dir') || 'ltr'
}

onMounted(() => {
  dark.value = document.documentElement.classList.contains('dark')
  dir.value = document.documentElement.getAttribute('dir') || 'ltr'
})
</script>

<style scoped>
</style>
