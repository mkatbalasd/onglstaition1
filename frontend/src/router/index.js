import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../views/Dashboard.vue') },
  { path: '/drivers', component: () => import('../views/Drivers.vue') },
  { path: '/driver-cards', component: () => import('../views/DriverCards.vue') },
  { path: '/vehicles', component: () => import('../views/Vehicles.vue') },
  { path: '/facilities', component: () => import('../views/Facilities.vue') },
  { path: '/cards', component: () => import('../views/Cards.vue') },
  { path: '/settings', component: () => import('../views/Settings.vue') },
  { path: '/settings/brands', component: () => import('../views/Settings/Brands.vue') },
  { path: '/settings/models', component: () => import('../views/Settings/Models.vue') },
  { path: '/settings/colors', component: () => import('../views/Settings/Colors.vue') },
  { path: '/settings/license-types', component: () => import('../views/Settings/LicenseTypes.vue') },
  { path: '/settings/suppliers', component: () => import('../views/Settings/Suppliers.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
