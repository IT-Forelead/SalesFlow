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
    beforeEnter: navigationGuards('view_products'),
  },
  {
    path: '/product-histories',
    name: 'Product histories',
    component: () => import('../pages/ProductHistories.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('view_histories'),
  },
  {
    path: '/product-barcodes',
    name: 'Product barcodes',
    component: () => import('../pages/ProductBarcodes.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('dashboard'),
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../pages/Orders.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('view_orders'),
  },
  {
    path: '/markets',
    name: 'Markets',
    component: () => import('../pages/Markets.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('view_markets'),
  },
  {
    path: '/sales',
    name: 'Sales',
    component: () => import('../pages/Sales.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('create_product'),
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../pages/Users.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('view_users'),
  },
  {
    path: '/sale-settings',
    name: 'Sale settings',
    component: () => import('../pages/SaleSettings.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('view_settings'),
  },
  {
    path: '/customer-form/:orderId',
    name: 'Customer form',
    component: () => import('../pages/CustomerForm.vue'),
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
  const publicPages = ['/', '/login', '/customer-form']
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
