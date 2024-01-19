<script setup>
import { useSidebarStore } from '../store/sidebar.store.js'
import HamburgerMenuOutlineIcon from '../assets/icons/HamburgerMenuOutlineIcon.vue'
import { useModalStore } from '../store/modal.store.js'
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import CreateMarketModal from '../components/modals/CreateMarketModal.vue'
import CreateProductModal from '../components/modals/CreateProductModal.vue'
import CreateProductHistoryModal from '../components/modals/CreateProductHistoryModal.vue'
import CreateUserModal from './modals/CreateUserModal.vue'

const notificationDropdown = ref(null)

onClickOutside(notificationDropdown, () => {
  if (useModalStore().isOpenNotification) {
    useModalStore().toggleNotification()
  }
})

</script>

<template>
  <div class="sticky top-0 z-50 flex items-center w-full px-6 py-4 bg-white border-b border-gray-200 shadow-7xl lg:hidden">
    <div class="flex space-x-4 items-center">
      <div @click="useSidebarStore().toggleSidebar"
           class="flex lg:hidden items-center justify-center w-8 h-8 rounded-lg cursor-pointer hover:bg-gray-100">
        <HamburgerMenuOutlineIcon class="w-6 h-6" />
      </div>
      <div class="text-slate-700 text-2xl md:text-3xl font-semibold">
        {{ useSidebarStore().currentPage }}
      </div>
    </div>
  </div>

  <CreateMarketModal />
  <CreateProductModal />
  <CreateProductHistoryModal />
  <CreateUserModal/>
</template>

<style scoped></style>