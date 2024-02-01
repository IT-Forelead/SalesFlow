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
    beforeEnter: navigationGuards('dashboard'),
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../pages/Products.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('dashboard'),
  },
  {
    path: '/product-histories',
    name: 'Product histories',
    component: () => import('../pages/ProductHistories.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('dashboard'),
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../pages/Orders.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('dashboard'),
  },
  {
    path: '/markets',
    name: 'Markets',
    component: () => import('../pages/Markets.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('dashboard'),
  },
  {
    path: '/sales',
    name: 'Sales',
    component: () => import('../pages/Sales.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('dashboard'),
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../pages/Users.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('dashboard'),
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

router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/login']
  const authNotRequired = !publicPages.includes(to.path)
  const notLoggedIn = localStorage.getItem('session')
  if ((authNotRequired && notLoggedIn) || publicPages.includes(`/${to.path.split('/')[1]}`)) {
    next()
  } else {
    next('/')
  }
})

function navigationGuards(access) {
  return () => {
    if (localStorage.getItem('session') && !parseJwt()?.privileges.includes(access)) {
      router.push('/notfound')
    }
    return parseJwt()?.privileges.includes(access)
  }
}

export default router
