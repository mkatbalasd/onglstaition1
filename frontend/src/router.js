import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('./views/HomeView.vue')
  },
  {
    path: '/driver-cards',
    component: () => import('./views/DriverCardsPage.vue')
  },
  {
    path: '/cards',
    component: () => import('./views/CardsPage.vue')
  },
  {
    path: '/facilities',
    component: () => import('./views/FacilitiesPage.vue')
  },
  {
    path: '/drivers',
    component: () => import('./views/DriversPage.vue')
  },
  {
    path: '/vehicles',
    component: () => import('./views/VehiclesPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/nagl/app/'),
  routes
})

export default router
