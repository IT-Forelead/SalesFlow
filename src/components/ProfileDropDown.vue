<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import AuthService from '../services/auth.service'
import { useModalStore } from '../store/modal.store'
import PhUser from '../assets/icons/UserIcon.vue'
import LogoutIcon from './../assets/icons/LogoutIcon.vue'
import PhGear from '../assets/icons/SettingsIcon.vue'
import PhCaretDown from '../assets/icons/CaretDownIcon.vue'

const router = useRouter()
const dropdown = ref(null)

onClickOutside(dropdown, () => {
  if (useModalStore().isOpenProfileDropDown) {
    useModalStore().toggleProfile()
  }
})

const logout = () => {
  AuthService.logout()
  router.push('/')
  if (useModalStore().isOpenProfileDropDown) {
    useModalStore().toggleProfile()
  }
}
</script>
<template>
  <div class="relative" ref="dropdown">
    <button @click="useModalStore().toggleProfile()"
            class="flex items-center p-3 space-x-2 md:p-4 bg-slate-100 text-slate-400 hover:text-blue-600 rounded-full hover:bg-blue-100 cursor-pointer transition duration-150"
            type="button">
      <PhUser class="w-7 h-7 mr-2" />
      Super Admin
      <PhCaretDown class="w-4 h-4" />
    </button>
    <ul v-if="useModalStore().isOpenProfileDropDown"
        class="w-48 absolute bg-white shadow-xl rounded-md z-20 md:top-[70px] top-[66px] right-0 divide-y divide-slate-200">
      <li class="px-4 py-3 text-sm text-slate-900">
        <div class="font-medium">Super Admin</div>
        <div class="truncate">+998901234567</div>
      </li>
      <li
        class="flex items-center text-slate-900 hover:bg-blue-100 hover:text-blue-600 rounded-t-md cursor-pointer p-2 space-x-2">
        <PhGear class="w-5 h-5" />
        <span>Settings</span>
      </li>
      <li @click="logout"
          class="flex items-center text-slate-900 hover:text-blue-600 hover:bg-blue-100 cursor-pointer p-2 space-x-2">
        <LogoutIcon class="w-5 h-5" />
        <span>Logout</span>
      </li>
    </ul>
  </div>
</template>
<style scoped></style>