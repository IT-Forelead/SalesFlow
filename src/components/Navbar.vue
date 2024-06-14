<script setup>
import { useSidebarStore } from '../store/sidebar.store.js'
import HamburgerMenuOutlineIcon from '../assets/icons/HamburgerMenuOutlineIcon.vue'
import { useModalStore } from '../store/modal.store.js'
import { onMounted, onUnmounted, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import CreateProductBarcodeModal from './modals/CreateProductBarcodeModal.vue'
import CreateMarketModal from '../components/modals/CreateMarketModal.vue'
import CreateProductModal from '../components/modals/CreateProductModal.vue'
import CreateProductHistoryModal from '../components/modals/CreateProductHistoryModal.vue'
import CreateUserModal from './modals/CreateUserModal.vue'
import OrderInfoModal from './modals/OrderInfoModal.vue'
import EditMarketModal from './modals/EditMarketModal.vue'
import EditUserModal from './modals/EditUserModal.vue'
import DeleteMarketModal from './modals/DeleteMarketModal.vue'
import DeleteProductHistoryModal from './modals/DeleteProductHistoryModal.vue'
import DeleteProductModal from './modals/DeleteProductModal.vue'
import EditProductHistoryModal from './modals/EditProductHistoryModal.vue'
import EditProductModal from './modals/EditProductModal.vue'
import DeleteUserModal from './modals/DeleteUserModal.vue'
import EditProductBarcodeModal from './modals/EditProductBarcodeModal.vue'
import CameraScannerModal from './modals/CameraScannerModal.vue'
import DeleteDebtorModal from './modals/DeleteDebtorModal.vue'
import DebtInfoModal from './modals/DebtInfoModal.vue'
import CreateLabelModal from './modals/CreateLabelModal.vue'
import CreateAgentModal from './modals/CreateAgentModal.vue'
import EditAgentModal from './modals/EditAgentModal.vue'
import CreateTelegramBotModal from './modals/CreateTelegramBotModal.vue'
import CreateHolidayDiscountModal from './modals/CreateHolidayDiscountModal.vue'
import DiscountInfoModal from './modals/DiscountInfoModal.vue'
import DeleteHolidayDiscountModal from './modals/DeleteHolidayDiscountModal.vue'

const notificationDropdown = ref(null)

onClickOutside(notificationDropdown, () => {
  if (useModalStore().isOpenNotification) {
    useModalStore().toggleNotification()
  }
})
let isMobile = window.innerWidth <= 1024;
let isDesktop = window.innerWidth > 1024;

const closeSidebar = () => {
  if (isMobile) {
    useSidebarStore().toggleSidebar = true;
  }
  useSidebarStore().isOpenSidebar = true;
}

const openSidebar = () => {
  if (isMobile) {
    useSidebarStore().toggleSidebar = false;
  }
  useSidebarStore().isOpenSidebar = false;
}

const handleResize = () => {
  isMobile = window.innerWidth <= 1024;
  isDesktop = window.innerWidth > 1024;

  if (isDesktop) {
    useSidebarStore().isOpenSidebar = true;
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div
    class="sticky top-0 xl:hidden flex items-center w-full px-6 py-4 bg-white border-b border-gray-200 shadow-7xl lg:block">
    <div class="flex space-x-4 items-center">
      <div v-if="!useSidebarStore().isOpenSidebar" @click="closeSidebar"
        class="flex lg:block xl:hidden sm:block items-center justify-center w-8 h-8 rounded-lg cursor-pointer hover:bg-gray-100">
        <HamburgerMenuOutlineIcon class="w-6 h-6" />
      </div>
      <div v-else-if="useSidebarStore().isOpenSidebar" @click="openSidebar"
           class="flex lg:block xl:hidden sm:block items-center justify-center w-8 h-8 rounded-lg cursor-pointer hover:bg-gray-100">
        <HamburgerMenuOutlineIcon class="w-6 h-6" />
      </div>
      <div class="flex space-x-1 lg:hidden items-center justify-center">
        <img src="/images/logo.svg" class="w-10 h-10" alt="#">
        <div class="text-2xl font-extrabold">
          <span class="text-[#0167f3]">Sale</span>
          <span class="text-black">Flow</span>
        </div>
      </div>
    </div>
  </div>

  <CreateProductBarcodeModal />
  <CreateMarketModal />
  <CreateProductModal />
  <CreateProductHistoryModal />
  <CreateUserModal />
  <OrderInfoModal />
  <EditMarketModal />
  <DeleteMarketModal />
  <DeleteProductModal/>
  <EditProductModal/>
  <DeleteProductHistoryModal/>
  <EditProductHistoryModal/>
  <EditUserModal/>
  <DeleteUserModal/>
  <EditProductBarcodeModal/>
  <CameraScannerModal/>
  <DeleteDebtorModal/>
  <DebtInfoModal/>
  <CreateLabelModal/>
  <CreateAgentModal/>
  <EditAgentModal/>
  <CreateTelegramBotModal/>
  <CreateHolidayDiscountModal/>
  <DiscountInfoModal/>
  <DeleteHolidayDiscountModal/>
</template>

<style scoped></style>