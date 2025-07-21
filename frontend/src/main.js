import './styles/tailwind.css'
import 'vue3-table-lite/src/css/app.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import MainLayout from './layouts/MainLayout.vue'
import router from './router'

function applyTheme() {
  const stored = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const shouldDark = stored ? stored === 'dark' : prefersDark
  document.documentElement.classList.toggle('dark', shouldDark)
}

function applyDir() {
  const dir = localStorage.getItem('dir') || 'ltr'
  document.documentElement.setAttribute('dir', dir)
}

window.toggleDark = () => {
  const html = document.documentElement
  const isDark = html.classList.toggle('dark')
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
}

window.toggleDir = () => {
  const html = document.documentElement
  const current = html.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr'
  const next = current === 'ltr' ? 'rtl' : 'ltr'
  html.setAttribute('dir', next)
  localStorage.setItem('dir', next)
}

applyTheme()
applyDir()

createApp(MainLayout)
  .use(createPinia())
  .use(router)
  .mount('#app')
