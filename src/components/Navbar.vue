<script setup>
import { useSidebarStore } from '../store/sidebar.store.js'
import HamburgerMenuOutlineIcon from '../assets/icons/HamburgerMenuOutlineIcon.vue'
import { useModalStore } from '../store/modal.store.js'
import { ref } from 'vue'
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
import BarcodeScannerModal from './modals/BarcodeScannerModal.vue'
import CreateSaleModal from './modals/CreateSaleModal.vue'

const notificationDropdown = ref(null)

onClickOutside(notificationDropdown, () => {
  if (useModalStore().isOpenNotification) {
    useModalStore().toggleNotification()
  }
})

</script>

<template>
  <div
    class="sticky top-0 z-50 flex items-center w-full px-6 py-4 bg-white border-b border-gray-200 shadow-7xl lg:hidden">
    <div class="flex space-x-4 items-center">
      <div @click="useSidebarStore().toggleSidebar"
        class="flex lg:hidden items-center justify-center w-8 h-8 rounded-lg cursor-pointer hover:bg-gray-100">
        <HamburgerMenuOutlineIcon class="w-6 h-6" />
      </div>
      <div class="flex space-x-1 items-center justify-center">
        <img src="/images/logo.svg" class="w-10 h-10" alt="#">
        <div class="text-2xl font-extrabold">
          <span class="text-[#0167f3]">Sale</span>
          <span class="text-black">Flow</span>
        </div>
      </div>
    </div>
  </div>

  <CreateSaleModal/>
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
  <BarcodeScannerModal/>

</template>

<style scoped></style>