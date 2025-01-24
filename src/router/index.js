import { createRouter, createWebHistory } from 'vue-router';
import { parseJwt } from '../mixins/utils.js';

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../pages/Login.vue'),
    meta: { layout: 'login' },
  },
  {
    path: '/app',
    name: 'App',
    component: () => import('../pages/App.vue'),
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
    path: '/upcoming-products',
    name: 'Upcoming products',
    component: () => import('../pages/UpcomingProducts.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('view_histories'),
  },
  {
    path: '/discounts',
    name: 'Discounts',
    component: () => import('../pages/Discounts.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('dashboard'),
  },
  {
    path: '/product-barcodes',
    name: 'Product barcodes',
    component: () => import('../pages/ProductBarcodes.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('dashboard'),
  },
  {
    path: '/barcode-duplicates',
    name: 'barcode-duplicates',
    component: () => import('../pages/BarcodeDuplicates.vue'),
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
    path: '/agents',
    name: 'Agents',
    component: () => import('../pages/Agents.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('view_agents'),
  },
  {
    path: '/vouchers',
    name: 'Vouchers',
    component: () => import('../pages/Vouchers.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('view_agents'),
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
    path: '/wishes',
    name: 'Wishes',
    component: () => import('../pages/Wishes.vue'),
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
    path: '/corporate-clients',
    name: 'Corporate clients',
    component: () => import('../pages/CorporateClients.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('view_settings'),
  },
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('../pages/Clients.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('view_settings'),
  },
  {
    path: '/sessions',
    name: 'Sessions',
    component: () => import('../pages/Session.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('view_settings'),
  },
  {
    path: '/cashback-histories',
    name: 'Cashbacks histories',
    component: () => import('../pages/CashbackHistories.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('view_settings'),
  },
  {
    path: '/ip-banned',
    name: 'IP banned',
    component: () => import('../pages/IPBanned.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('create_market'),
  },
  {
    path: '/investors',
    name: 'Investors',
    component: () => import('../pages/Investors.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('view_investors'),
  },
  {
    path: '/invests',
    name: 'Invests',
    component: () => import('../pages/Invests.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('view_invests'),
  },
  {
    path: '/invest-plans',
    name: 'Invest plans',
    component: () => import('../pages/InvestPlans.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('view_invest_plans'),
  },
  {
    path: '/price-lists',
    name: 'Price lists',
    component: () => import('../pages/PriceLists.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('view_agents'),
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('../pages/Categories.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('view_agents'),
  },
  {
    path: '/expenses',
    name: 'Expenses',
    component: () => import('../pages/Expenses.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: navigationGuards('view_agents'),
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
  {
    path: '/customer/order/:orderId',
    name: 'Customer Order',
    component: () => import('../pages/CustomerOrder.tsx'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/login', '/app', '/customer-form', '/customer'];
  const authNotRequired = !publicPages.includes(to.path);
  const notLoggedIn = localStorage.getItem('session');
  if ((authNotRequired && notLoggedIn) || publicPages.includes(`/${to.path.split('/')[1]}`)) {
    next();
  } else {
    next('/');
  }
});

function navigationGuards(access) {
  return () => {
    if (localStorage.getItem('session') && !parseJwt()?.privileges.includes(access)) {
      router.push('/notfound');
    }
    return parseJwt()?.privileges.includes(access);
  };
}

export default router;
