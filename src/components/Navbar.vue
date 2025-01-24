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
import CreateUpcomingProductModal from './modals/CreateUpcomingProductModal.vue'
import EditUpcomingProductStatusModal from './modals/EditUpcomingProductStatusModal.vue'
import EditProductModal from './modals/EditProductModal.vue'
import DeleteUserModal from './modals/DeleteUserModal.vue'
import EditProductBarcodeModal from './modals/EditProductBarcodeModal.vue'
import CameraScannerModal from './modals/CameraScannerModal.vue'
import DeleteCorporateClientModal from './modals/DeleteCorporateClientModal.vue'
import ClientInfoModal from './modals/ClientInfoModal.vue'
import CreateLabelModal from './modals/CreateLabelModal.vue'
import CreateAgentModal from './modals/CreateAgentModal.vue'
import EditAgentModal from './modals/EditAgentModal.vue'
import CreateTelegramBotModal from './modals/CreateTelegramBotModal.vue'
import CreateHolidayDiscountModal from './modals/CreateHolidayDiscountModal.vue'
import DiscountInfoModal from './modals/DiscountInfoModal.vue'
import DeleteHolidayDiscountModal from './modals/DeleteHolidayDiscountModal.vue'
import DeleteTelegramBotModal from './modals/DeleteTelegramBotModal.vue'
import EditTelegramBotModal from './modals/EditTelegramBotModal.vue'
import CreateCorporateClientModal from './modals/CreateCorporateClientModal.vue'
import FillBalanceModal from './modals/FillBalanceModal.vue'
import DeleteIPBanModal from './modals/DeleteIPBanModal.vue'
import CreateInvestorModal from './modals/CreateInvestorModal.vue'
import CreateInvestPlanModal from './modals/CreateInvestPlanModal.vue'
import InvestorInfoModal from './modals/InvestorInfoModal.vue'
import InvestDailyModal from './modals/InvestDailyModal.vue'
import EditInvestStatusModal from './modals/EditInvestStatusModal.vue'
import CashbackHistoryModal from './modals/CashbackHistoryModal.vue'
import CreatePriceModal from './modals/CreatePriceModal.vue'
import CreateVoucherModal from './modals/CreateVoucherModal.vue'
import AgentInfoModal from './modals/AgentInfoModal.vue'
import DeleteRecommendProduct from './modals/DeleteRecommendProduct.vue'
import HiddenProductsModal from './modals/HiddenProductsModal.vue'
import UnhideRecommendProduct from './modals/UnhideRecommendProduct.vue'
import CreateCategoryModal from './modals/CreateCategoryModal.vue'
import DeleteCategoryModal from './modals/DeleteCategoryModal.vue'
import EditCategoryModal from './modals/EditCategoryModal.vue'
import EditOrderModal from './modals/EditOrderModal.vue'
import CreateExpenseModal from './modals/CreateExpenseModal.vue'
import EditExpenseModal from './modals/EditExpenseModal.vue'
import DeleteUnprofitableProduct from './modals/DeleteUnprofitableProduct.vue'
import HiddenUnprofitableProductsModal from './modals/HiddenUnprofitableProductsModal.vue'
import UnhideUnprofitableProduct from './modals/UnhideUnprofitableProduct.vue'
import CreateWhiteListModal from './modals/CreateWhiteListModal.vue'
import EditWhiteListModal from './modals/EditWhiteListModal.vue'
import DeleteWhiteListModal from './modals/DeleteWhiteListModal.vue'

import CreateInvestModal from './modals/CreateInvestModal.vue'
import DeleteInvestModal from './modals/DeleteInvestModal.vue'

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
    useSidebarStore().toggleSidebar(true);
  }
  useSidebarStore().setSidebarState(true);
}

const openSidebar = () => {
  if (isMobile) {
    useSidebarStore().toggleSidebar(false);
  }
  useSidebarStore().setSidebarState(false);
}

const handleResize = () => {
  // isMobile = window.innerWidth <= 1024;
  isDesktop = window.innerWidth > 10000;

  if (isDesktop) {
    useSidebarStore().setSidebarState(true);
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  document.documentElement.className = savedTheme ? savedTheme : 'light'
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div v-if="!useSidebarStore().isOpenSidebar"
    class="sticky flex items-center w-full px-6 py-4 bg-white dark:bg-slate-900 border-b border-gray-200 shadow-7xl lg:block">
    <div class="flex space-x-4 items-center">
      <div v-if="!useSidebarStore().isOpenSidebar" @click="closeSidebar"
        class="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer hover:bg-gray-100 dark:text-white dark:hover:bg-gray-500">
        <HamburgerMenuOutlineIcon class="w-6 h-6" />
      </div>
      <div v-else-if="useSidebarStore().isOpenSidebar" @click="openSidebar"
        class="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer hover:bg-gray-100">
        <HamburgerMenuOutlineIcon class="w-6 h-6" />
      </div>
      <div class="flex space-x-1 items-center justify-center">
        <img src="/images/logo.svg" class="w-10 h-10" alt="#">
        <div class="text-2xl font-extrabold">
          <span class="text-[#0167f3]">Sale</span>
          <span class="dark:text-white">Flow</span>
        </div>
      </div>
    </div>
  </div>

  <CreateProductBarcodeModal />
  <CreateMarketModal />
  <CreateProductModal />
  <CreateUpcomingProductModal />
  <CreateProductHistoryModal />
  <CreateUserModal />
  <OrderInfoModal />
  <EditMarketModal />
  <DeleteMarketModal />
  <DeleteProductModal />
  <EditProductModal />
  <DeleteProductHistoryModal />
  <EditProductHistoryModal />
  <EditUserModal />
  <DeleteUserModal />
  <EditProductBarcodeModal />
  <CameraScannerModal />
  <DeleteCorporateClientModal />
  <ClientInfoModal />
  <CreateLabelModal />
  <CreateAgentModal />
  <EditAgentModal />
  <CreateTelegramBotModal />
  <CreateHolidayDiscountModal />
  <DiscountInfoModal />
  <DeleteHolidayDiscountModal />
  <EditUpcomingProductStatusModal />
  <DeleteTelegramBotModal />
  <EditTelegramBotModal />
  <EditTelegramBotModal />
  <CreateCorporateClientModal />
  <FillBalanceModal />
  <DeleteIPBanModal />
  <CreateInvestorModal />
  <CreateInvestPlanModal />
  <InvestorInfoModal />
  <InvestDailyModal />
  <EditInvestStatusModal />
  <CashbackHistoryModal />
  <CreatePriceModal />
  <CreateVoucherModal />
  <AgentInfoModal />
  <DeleteRecommendProduct />
  <HiddenProductsModal />
  <UnhideRecommendProduct />
  <CreateCategoryModal />
  <DeleteCategoryModal />
  <EditCategoryModal />
  <DeleteUnprofitableProduct />
  <HiddenUnprofitableProductsModal />
  <UnhideUnprofitableProduct />
  <EditOrderModal />
  <CreateExpenseModal />
  <EditExpenseModal />
  <CreateInvestModal />
  <DeleteInvestModal />
  <EditWhiteListModal />
  <CreateWhiteListModal />
  <DeleteWhiteListModal />
</template>

<style scoped></style>