import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import position from '../views/position.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'home'
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
  },
  {
    path: '/position',
    name: 'position',
    component: position
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
