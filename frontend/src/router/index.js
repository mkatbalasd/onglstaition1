import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/driver-cards',
    name: 'DriverCards',
    component: () => import('../views/DriverCards.vue')
  },
  {
    path: '/driver-cards/new',
    name: 'DriverCardsNew',
    component: () => import('../views/DriverCardsNew.vue')
  },
  {
    path: '/driver-cards/new/:facilityId/driver',
    name: 'DriverCardsDriver',
    component: () => import('../views/DriverCardsDriver.vue')
  },
  {
    path: '/driver-cards/:id',
    name: 'DriverCardsForm',
    component: () => import('../views/DriverCardsForm.vue')
  },
  {
    path: '/driver-cards/:id/print',
    name: 'DriverCardsPrint',
    component: () => import('../views/DriverCardsPrint.vue')
  },
  {
    path: '/operating-cards',
    name: 'OperatingCards',
    component: () => import('../views/OperatingCards.vue')
  },
  {
    path: '/operating-cards/new',
    name: 'OperatingCardsNew',
    component: () => import('../views/OperatingCardsNew.vue')
  },
  {
    path: '/facilities',
    name: 'Facilities',
    component: () => import('../views/Facilities.vue')
  },
  {
    path: '/facilities/new',
    name: 'FacilitiesNew',
    component: () => import('../views/FacilitiesNew.vue')
  },
  {
    path: '/drivers',
    name: 'Drivers',
    component: () => import('../views/Drivers.vue')
  },
  {
    path: '/drivers/new',
    name: 'DriversNew',
    component: () => import('../views/DriversNew.vue')
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    component: () => import('../views/Vehicles.vue')
  },
  {
    path: '/vehicles/new',
    name: 'VehiclesNew',
    component: () => import('../views/VehiclesNew.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/nagl/app/'),
  routes
})

export default router
