import Vue from 'vue'
import VueRouter from 'vue-router'
import Sold from '../views/Sold.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Sold',
    component: Sold
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
