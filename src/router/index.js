import { createRouter, createWebHistory } from 'vue-router'
import { parseJwt } from '../mixins/utils.js'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../pages/Login.vue'),
    meta: { layout: 'login' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../pages/Dashboard.vue'),
    meta: { layout: 'dashboard' },
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('../views/Transactions.vue'),
    meta: { layout: 'dashboard' },
  },
  {
    path: '/notfound',
    name: 'Not-Found',
    component: () => import('../components/NotFound.vue'),
  },
  {
    path: '/:pathMach(.*)*',
    name: 'NotFound',
    component: () => import('../components/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

// router.beforeEach((to, from, next) => {
//   const publicPages = ['/', '/login', '/sign-up', '/forgot-password', '/reset-password', '/dashboard']
//   const authNotRequired = !publicPages.includes(to.path)
//   const notLoggedIn = localStorage.getItem('session')
//   if ((authNotRequired && notLoggedIn) || publicPages.includes(`/${to.path.split('/')[1]}`)) {
//     next()
//   } else {
//     next('/')
//   }
// })

function navigationGuards(access) {
  return () => {
    if (localStorage.getItem('session') && !access.includes(parseJwt()?.role)) {
      router.push('/notfound')
    }
    return access.includes(parseJwt()?.role)
  }
}

export default router
