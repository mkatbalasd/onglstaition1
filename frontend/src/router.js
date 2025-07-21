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
    path: '/driver-cards/new',
    component: () => import('./views/DriverCardsNew.vue')
  },
  {
    path: '/driver-cards/new/:facilityId/driver',
    component: () => import('./views/DriverCardsDriver.vue')
  },
  {
    path: '/driver-cards/new/:facilityId/driver/:driverId',
    component: () => import('./views/DriverCardsForm.vue')
  },
  {
    path: '/driver-cards/:id/edit',
    component: () => import('./views/EditDriverCard.vue')
  },
  {
    path: '/driver-cards/print/:token',
    component: () => import('./views/DriverCardsPrint.vue')
  },
  {
    path: '/cards',
    component: () => import('./views/Cards.vue')
  },
  {
    path: "/cards/new",
    component: () => import("./views/OperatingCardsNew.vue")
  },
  {
    path: "/cards/:id/edit",
    component: () => import("./views/OperatingCardsNew.vue")
  },
  {
    path: '/facilities',
    component: () => import('./views/Facilities.vue')
  },
  {
    path: "/facilities/new",
    component: () => import("./views/FacilitiesNew.vue")
  },
  {
    path: '/drivers',
    component: () => import('./views/Drivers.vue')
  },
  {
    path: "/drivers/new",
    component: () => import("./views/DriversNew.vue")
  },
  {
    path: '/vehicles',
    component: () => import('./views/Vehicles.vue')
  },
  {
    path: "/vehicles/new",
    component: () => import("./views/VehiclesNew.vue")
  },
]

const router = createRouter({
  history: createWebHistory('/nagl/app/'),
  routes
})

export default router
