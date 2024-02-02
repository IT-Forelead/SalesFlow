<script setup>
import { ref, onMounted } from 'vue'
import HouseIcon from './../assets/icons/HouseIcon.vue'
import MoneyIcon from './../assets/icons/MoneyIcon.vue'
import PhShoppingCart from '../assets/icons/ShoppingCartIcon.vue'
import PhBarcodeIcon from '../assets/icons/BarcodeIcon.vue'
import UsersIcon from '../assets/icons/UsersIcon.vue'
import StoreIcon from '../assets/icons/StoreIcon.vue'
import { useRouter } from 'vue-router'
import decodeJwt, { parseJwt } from '../mixins/utils';
import { useSidebarStore } from '../store/sidebar.store'
import ProfileDropDown from './ProfileDropDown.vue'
import { useAuthStore } from '../store/auth.store'

const router = useRouter()

const payload = ref({})

const selectPage = () => {
  useSidebarStore().isOpenSidebar = false
}

const closeSidebar = (event) => {
  if (event.target.closest('#sidebar') === null) {
    useSidebarStore().isOpenSidebar = false;
  }
}

onMounted(() => {
  useAuthStore().setUser(decodeJwt(JSON.parse(localStorage.getItem('session'))?.accessToken))
  payload.value = parseJwt()
})
</script>
<template>
  <div class="relative z-40" v-if="useSidebarStore().toggleSidebar">
    <div class="fixed inset-0 z-40 transition-opacity duration-200 bg-slate-900 bg-opacity-30 lg:hidden lg:z-auto"
      :class="useSidebarStore().isOpenSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'" @click="closeSidebar">
    </div>
    <div id="sidebar" ref="sidebar"
      class="flex flex-col bg-slate-100 absolute z-40 left-0 top-0 lg:static border-r lg:left-auto lg:top-auto lg:translate-x-0 min-h-screen w-64 2xl:w-72 shrink-0 transition-all duration-200 ease-in-out"
      :class="useSidebarStore().isOpenSidebar ? 'translate-x-0' : '-translate-x-64'">
      <div class="h-20 flex space-x-1 items-center justify-center">
        <img src="/images/logo.svg" class="w-12 h-12" alt="#">
        <div class="text-3xl font-extrabold">
          <span class="text-[#0167f3]">Sale</span>
          <span class="text-black">Flow</span>
        </div>
      </div>
      <div class="space-y-8 py-4">
        <ProfileDropDown />
        <div class="relative space-y-1 h-5/6 overflow-y-auto">
          <router-link to="/dashboard" @click="selectPage()" active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-7 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <HouseIcon class="w-6 h-6" />
            </div>
            <div>Bosh sahifa</div>
          </router-link>
          <router-link to="/sales" @click="selectPage()" active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-7 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex items-center justify-center rounded-xl w-10 h-10 second-child-bg-color">
              <MoneyIcon class="w-6 h-6" />
            </div>
            <div>Sotuv</div>
          </router-link>
          <router-link to="/products" @click="selectPage()" active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-7 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex items-center justify-center rounded-xl w-10 h-10 second-child-bg-color">
              <PhShoppingCart class="w-6 h-6" />
            </div>
            <div>Mahsulotlar</div>
          </router-link>
          <router-link to="/product-histories" @click="selectPage()" active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-7 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex items-center justify-center rounded-xl w-10 h-10 second-child-bg-color">
              <PhShoppingCart class="w-6 h-6" />
            </div>
            <div>Mahsulotlar tarixi</div>
          </router-link>
          <router-link to="/product-barcodes" @click="selectPage()" active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-7 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex items-center justify-center rounded-xl w-10 h-10 second-child-bg-color">
              <PhBarcodeIcon class="w-6 h-6" />
            </div>
            <div>Shtrix kodlar</div>
          </router-link>
          <router-link to="/orders" @click="selectPage()" active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-7 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex items-center justify-center rounded-xl w-10 h-10 second-child-bg-color">
              <PhShoppingCart class="w-6 h-6" />
            </div>
            <div>Sotuvlar</div>
          </router-link>
          <router-link to="/markets" @click="selectPage()" active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-7 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex items-center justify-center rounded-xl w-10 h-10 second-child-bg-color">
              <StoreIcon class="w-6 h-6" />
            </div>
            <div>Do'konlar</div>
          </router-link>
          <router-link to="/users" @click="selectPage()" active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-7 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex items-center justify-center rounded-xl w-10 h-10 second-child-bg-color">
              <UsersIcon class="w-6 h-6" />
            </div>
            <div>Foydalanuvchilar</div>
          </router-link>
        </div>
      </div>
      <div class="absolute bottom-0 w-full mb-3 text-xs text-center text-slate-400">
        Copyright &copy; {{ new Date().getFullYear() }} <a href="https://it-forelead.uz"
          class="hover:underline">IT-Forelead</a>.
      <br />
      All Rights Reserved.
    </div>
  </div>
</div></template>
