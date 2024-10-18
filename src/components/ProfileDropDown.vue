<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import AuthService from '../services/auth.service'
import { useModalStore } from '../store/modal.store'
import { useAuthStore } from '../store/auth.store'
import UserIcon from '../assets/icons/UserIcon.vue'
import LogoutIcon from './../assets/icons/LogoutIcon.vue'
import SettingsIcon from '../assets/icons/SettingsIcon.vue'
import DotsThreeVerticalBoldIcon from '../assets/icons/DotsThreeVerticalBoldIcon.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const dropdown = ref(null)

onClickOutside(dropdown, () => {
  if (useModalStore().isOpenProfileDropDown) {
    useModalStore().toggleProfile()
  }
})

const logout = () => {
  AuthService.logout(() => router.push('/'))

  if (useModalStore().isOpenProfileDropDown) {
    useModalStore().toggleProfile()
  }
}
</script>
<template>
  <div class="relative" ref="dropdown">
    <div class="flex items-center justify-between px-3 dark:text-white">
      <div class="inline-flex items-center space-x-2">
        <div class="relative flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 bg-[#0167f3] text-white text-base md:text-lg font-medium rounded-full">
          <span>
            {{ useAuthStore().user?.firstname?.at(0) + useAuthStore().user?.lastname?.at(0) }}
          </span>
          <div class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border border-white"></div>
        </div>
        <div>
          <div class="text-sm md:text-base font-medium dark:text-white whitespace-nowrap">
            {{ useAuthStore().user?.firstname + ' ' + useAuthStore().user?.lastname }}
          </div>
          <div class="text-sm dark:text-white">
            {{ useAuthStore().user?.login }}
          </div>
        </div>
      </div>
      <div @click="useModalStore().toggleProfile()" class="hover:dark:bg-gray-500 hover:bg-gray-100 p-0.5 rounded-lg cursor-pointer" :class="useModalStore().isOpenProfileDropDown ? 'dark:bg-gray-400 bg-gray-100 ' : ''">
        <DotsThreeVerticalBoldIcon class="w-5 h-5" />
      </div>
    </div>
    <div v-if="useModalStore().isOpenProfileDropDown" class="absolute z-50 top-11 md:top-0 right-2 md:-right-[200px] w-52 dark:bg-slate-600 bg-white border border-gray-200 shadow rounded-lg divide-y divide-gray-200">
      <ul class="p-1.5 relative">
        <li class="flex items-center dark:text-white hover:bg-blue-100 hover:text-blue-600 rounded-lg cursor-pointer p-2 space-x-2">
          <UserIcon class="w-5 h-5" />
          <span>{{ $t('profile') }}</span>
        </li>
        <li class="flex items-center dark:text-white hover:bg-blue-100 hover:text-blue-600 rounded-lg cursor-pointer p-2 space-x-2">
          <SettingsIcon class="w-5 h-5" />
          <span>{{ $t('settings') }}</span>
        </li>
      </ul>
      <div class="p-1.5">
        <div @click="logout" class="flex items-center dark:text-white hover:text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer p-2 space-x-2">
          <LogoutIcon class="w-5 h-5" />
          <span>{{ $t('logout') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
