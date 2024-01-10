<script setup>
import SearchIcon from '../assets/icons/SearchIcon.vue'
import PhGear from '../assets/icons/SettingsIcon.vue'
import PhBell from '../assets/icons/BellIcon.vue'
import ProfileDropDown from './ProfileDropDown.vue'
import { useSidebarStore } from '../store/sidebar.store.js'
import HamburgerMenuOutlineIcon from '../assets/icons/HamburgerMenuOutlineIcon.vue'
import { useModalStore } from '../store/modal.store.js'
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const notificationDropdown = ref(null)

onClickOutside(notificationDropdown, () => {
  if (useModalStore().isOpenNotification) {
    useModalStore().toggleNotification()
  }
})

</script>

<template>
  <div
    class="sticky top-0 z-50 flex items-center justify-between w-full h-20 px-6 py-4 bg-white border-b border-gray-200 shadow-7xl">
    <div class="flex space-x-4 items-center">
      <div @click="useSidebarStore().toggleSidebar"
           class="flex lg:hidden items-center justify-center w-8 h-8 rounded-lg cursor-pointer hover:bg-gray-100">
        <HamburgerMenuOutlineIcon class="w-6 h-6" />
      </div>
      <div class="text-slate-700 text-2xl md:text-3xl font-semibold">
        {{useSidebarStore().currentPage}}
      </div>
    </div>
    <div class="flex items-center space-x-4 md:space-x-6">
      <router-link to="/settings"
                   class="p-2 md:p-3 bg-slate-100 text-slate-400 hover:text-blue-600 rounded-full hover:bg-blue-100 cursor-pointer transition duration-150 hidden md:block">
        <PhGear class="w-6 h-6" />
      </router-link>
      <div class="relative hidden md:block" ref="notificationDropdown">
        <div @click="useModalStore().toggleNotification"
             class="p-2 md:p-3 bg-slate-100 text-red-400 hover:text-red-600 rounded-full hover:bg-red-100 cursor-pointer transition duration-150">
          <PhBell class="w-6 h-6" />
        </div>
        <div v-if="useModalStore().isOpenNotification"
             class="absolute flex flex-col items-center justify-center bg-white w-72 h-40 shadow-xl rounded-md p-3 z-20 top-[60px] md:top-16 -right-16 space-y-2">
          <div class="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 shadow">
            <PhBell class="w-10 h-10 text-slate-400" />
          </div>
          <div class="text-sm">Hech qanday bildirishnoma yo'q</div>
        </div>
      </div>
      <ProfileDropDown />
    </div>
  </div>
</template>

<style scoped></style>