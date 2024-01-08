<script setup>
import HouseIcon from './../assets/icons/HouseIcon.vue'
import MoneyIcon from './../assets/icons/MoneyIcon.vue'
import PhUser from '../assets/icons/UserIcon.vue'
import PhGear from '../assets/icons/SettingsIcon.vue'
import PhShoppingCart from '../assets/icons/ShoppingCartIcon.vue'
</script>

<template>
  <div class="fixed block h-screen bg-white w-64 z-50 border-r">
    <div class="h-20 flex space-x-1 items-center justify-center">
      <PhShoppingCart class="w-12 h-12 text-blue-700" />
      <p class="text-2xl text-black font-extrabold">MarketStore</p>
    </div>
    <div class="relative space-y-1 py-6 h-5/6 overflow-y-auto">
      <router-link to="/dashboard" active-class="active" class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-7 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
        <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
        <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
          <HouseIcon class="w-6 h-6" />
        </div>
        <div>Dashboard</div>
      </router-link>
      <router-link to="/transactions" active-class="active" class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-7 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
        <div class="w-1.5 h-10 rounded-r-xl first-child-bg-color mr-2"></div>
        <div class="flex items-center justify-center rounded-xl w-10 h-10 second-child-bg-color">
          <MoneyIcon class="w-6 h-6" />
        </div>
        <div>Transactions</div>
      </router-link>
      <router-link to="/products" active-class="active" class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-7 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
        <div class="w-1.5 h-10 rounded-r-xl first-child-bg-color mr-2"></div>
        <div class="flex items-center justify-center rounded-xl w-10 h-10 second-child-bg-color">
          <PhShoppingCart class="w-6 h-6" />
        </div>
        <div>Products</div>
      </router-link>
      <router-link to="accounts" active-class="active" class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-7 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
        <div class="w-1.5 h-10 rounded-r-xl first-child-bg-color mr-2"></div>
        <div class="flex items-center justify-center rounded-xl w-10 h-10 second-child-bg-color">
          <PhUser class="w-6 h-6" />
        </div>
        <div>Accounts</div>
      </router-link>
      <router-link to="settings" active-class="active" class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-7 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
        <div class="w-1.5 h-10 rounded-r-xl first-child-bg-color mr-2"></div>
        <div class="flex items-center justify-center rounded-xl w-10 h-10 second-child-bg-color">
          <PhGear class="w-6 h-6" />
        </div>
        <div>Settings</div>
      </router-link>
    </div>
    <div class="absolute bottom-0 w-full mb-3 text-sm text-center dark:text-gray-400">
      Copyright &copy; {{ new Date().getFullYear() }} <a href="https://it-forelead.uz" class="hover:underline">IT-Forelead</a>.
      <br />
      All Rights Reserved.
    </div>
  </div>
</template>
