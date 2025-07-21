import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('./views/HomeView.vue')
  },
  {
    path: '/driver-cards',
    component: () => import('./pages/DriverCards.vue')
  },
  {
    path: '/cards',
    component: () => import('./views/Cards.vue')
  },
  {
    path: '/facilities',
    component: () => import('./views/Facilities.vue')
  },
  {
    path: '/drivers',
    component: () => import('./views/Drivers.vue')
  },
  {
    path: '/vehicles',
    component: () => import('./views/Vehicles.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/nagl/app/'),
  routes
})

export default router
