import './styles/tailwind.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import CardsManagement from './views/CardsManagement.vue'

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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes: [
    { path: '/', component: Home },
    { path: '/cards', component: CardsManagement }
  ]
})

createApp(App)
  .use(router)
  .mount('#app')
