import { MotionPlugin } from '@vueuse/motion'
import 'flowbite'
import { createPinia } from 'pinia'
import money from 'v-money3'
import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'
import { createApp } from 'vue'
import Vue3Marquee from 'vue3-marquee'
import VueApexCharts from 'vue3-apexcharts'
import VOtpInput from 'vue3-otp-input'
import App from './App.vue'
import i18n from './i18n.js'
import DashboardLayout from './layouts/DashboardLayout.vue'
import LoginLayout from './layouts/LoginLayout.vue'
import router from './router'
import './style.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(money)
app.use(i18n)
app.use(MotionPlugin)
app.use(VueApexCharts)
app.use(Vue3Marquee)
app.component('dashboard-layout', DashboardLayout)
app.component('login-layout', LoginLayout)
app.component('infinite-loading', InfiniteLoading)
app.component('v-otp-input', VOtpInput)
app.mount('#app')
