import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state:()=>({
    isOpenEditTelegramBotModal: false,
    isOpenDeleteTelegramBotModal: false,
    isOpenDeleteHolidayDiscountModal: false,
    isOpenDiscountInfoModal: false,
    isOpenCreateHolidayDiscountModal: false,
    isOpenProfileDropDown: false,
    isOpenNotification: false,
    isOpenEditProductModal: false,
    isOpenDeleteProductModal: false,
    isOpenCreateUpcomingProductModal: false,
    isOpenEditUpcomingProductStatusModal: false,
    isOpenCreateProductBarcodeModal: false,
    isOpenCreateUserModal: false,
    isOpenCreateAgentModal: false,
    isOpenEditUserModal: false,
    isOpenEditAgentModal: false,
    isOpenDeleteUserModal: false,
    isOpenOrderInfoModal: false,
    isOpenCreateMarketModal: false,
    isOpenEditMarketModal: false,
    isOpenDeleteMarketModal: false,
    isOpenCreateProductModal: false,
    isOpenCreateLabelModal: false,
    isOpenCreateProductHistoryModal: false,
    isOpenDeleteProductHistoryModal: false,
    isOpenEditProductHistoryModal: false,
    isOpenEditProductBarcodeModal: false,
    isOpenCameraScannerModal: false,
    isOpenBarcodeScannerModal: false,
    isOpenDeleteDebtorModal: false,
    isOpenDebtInfoModal: false,
    isOpenUploadImageToProductModal: false,
    isOpenCreateTelegramBotModal: false,
    isOpenUtilizeProductModal: false,
    isOpenCardIdModal: false,
    isOpenCreateWishModal: false,
  }),
  actions: {
    openEditTelegramBotModal() {
      this.isOpenEditTelegramBotModal = true
    },
    closeEditTelegramBotModal() {
      this.isOpenEditTelegramBotModal = false
    },
    openDeleteTelegramBotModal() {
      this.isOpenDeleteTelegramBotModal = true
    },
    closeDeleteTelegramBotModal() {
      this.isOpenDeleteTelegramBotModal = false
    },
    openDeleteHolidayDiscountModal() {
      this.isOpenDeleteHolidayDiscountModal = true
    },
    closeDeleteHolidayDiscountModal() {
      this.isOpenDeleteHolidayDiscountModal = false
    },
    openDiscountInfoModal() {
      this.isOpenDiscountInfoModal = true
    },
    closeDiscountInfoModal() {
      this.isOpenDiscountInfoModal = false
    },
    openCreateHolidayDiscountModal() {
      this.isOpenCreateHolidayDiscountModal = true
    },
    closeCreateHolidayDiscountModal() {
      this.isOpenCreateHolidayDiscountModal = false
    },
    openCreateTelegramBotModal() {
      this.isOpenCreateTelegramBotModal = true
    },
    closeCreateTelegramBotModal() {
      this.isOpenCreateTelegramBotModal = false
    },
    openCreateProductBarcodeModal() {
      this.isOpenCreateProductBarcodeModal = true
    },
    closeCreateProductBarcodeModal() {
      this.isOpenCreateProductBarcodeModal = false
    },
    openCreateUserModal() {
      this.isOpenCreateUserModal = true
    },
    closeCreateUserModal() {
      this.isOpenCreateUserModal = false
    },
    openCreateAgentModal() {
      this.isOpenCreateAgentModal = true
    },
    closeCreateAgentModal() {
      this.isOpenCreateAgentModal = false
    },
    openEditUserModal() {
      this.isOpenEditUserModal = true
    },
    closeEditUserModal() {
      this.isOpenEditUserModal = false
    },
    openEditAgentModal() {
      this.isOpenEditAgentModal = true
    },
    closeEditAgentModal() {
      this.isOpenEditAgentModal = false
    },
    openDeleteUserModal() {
      this.isOpenDeleteUserModal = true
    },
    closeDeleteUserModal() {
      this.isOpenDeleteUserModal = false
    },
    openEditProductModal() {
      this.isOpenEditProductModal = true
    },
    closeEditProductModal() {
      this.isOpenEditProductModal = false
    },
    openDeleteProductModal() {
      this.isOpenDeleteProductModal = true
    },
    closeDeleteProductModal() {
      this.isOpenDeleteProductModal = false
    },
    openCreateUpcomingProductModal() {
      this.isOpenCreateUpcomingProductModal = true
    },
    closeCreateUpcomingProductModal() {
      this.isOpenCreateUpcomingProductModal = false
    },
    openEditUpcomingProductStatusModal() {
      this.isOpenEditUpcomingProductStatusModal = true
    },
    closeEditUpcomingProductStatusModal() {
      this.isOpenEditUpcomingProductStatusModal = false
    },
    openOrderInfoModal() {
      this.isOpenOrderInfoModal = true
    },
    closeOrderInfoModal() {
      this.isOpenOrderInfoModal = false
    },
    openCreateMarketModal() {
      this.isOpenCreateMarketModal = true
    },
    closeCreateMarketModal() {
      this.isOpenCreateMarketModal = false
    },
    openEditMarketModal() {
      this.isOpenEditMarketModal = true
    },
    closeEditMarketModal() {
      this.isOpenEditMarketModal = false
    },
    openDeleteMarketModal() {
      this.isOpenDeleteMarketModal = true
    },
    closeDeleteMarketModal() {
      this.isOpenDeleteMarketModal = false
    },
    openCreateProductModal() {
      this.isOpenCreateProductModal = true
    },
    closeCreateProductModal() {
      this.isOpenCreateProductModal = false
    },
    openCreateLabelModal() {
      this.isOpenCreateLabelModal = true
    },
    closeCreateLabelModal() {
      this.isOpenCreateLabelModal = false
    },
    openCreateProductHistoryModal() {
      this.isOpenCreateProductHistoryModal = true
    },
    closeCreateProductHistoryModal() {
      this.isOpenCreateProductHistoryModal = false
    },
    openDeleteProductHistoryModal() {
      this.isOpenDeleteProductHistoryModal = true
    },
    closeDeleteProductHistoryModal() {
      this.isOpenDeleteProductHistoryModal = false
    },
    openEditProductHistoryModal() {
      this.isOpenEditProductHistoryModal = true
    },
    closeEditProductHistoryModal() {
      this.isOpenEditProductHistoryModal = false
    },
    openEditProductBarcodeModal(){
      this.isOpenEditProductBarcodeModal = true
    },
    closeEditProductBarcodeModal(){
      this.isOpenEditProductBarcodeModal = false
    },
    openCameraScannerModal() {
      this.isOpenCameraScannerModal = true
    },
    closeCameraScannerModal() {
      this.isOpenCameraScannerModal = false
    },
    openDeleteDebtorModal() {
      this.isOpenDeleteDebtorModal = true
    },
    closeDeleteDebtorModal() {
      this.isOpenDeleteDebtorModal = false
    },
    openDebtInfoModal() {
      this.isOpenDebtInfoModal = true
    },
    closeDebtInfoModal() {
      this.isOpenDebtInfoModal = false
    },
    openUploadImageToProductModal() {
      this.isOpenUploadImageToProductModal = true
    },
    closeUploadImageToProductModal() {
      this.isOpenUploadImageToProductModal = false
    },
    toggleNotification() {
      this.isOpenNotification = !this.isOpenNotification
    },
    toggleProfile() {
      this.isOpenProfileDropDown = !this.isOpenProfileDropDown
    },
    openUtilizeProductModal() {
      this.isOpenUtilizeProductModal = true
    },
    closeUtilizeProductModal() {
      this.isOpenUtilizeProductModal = false
    },
    openCardIdModal() {
      this.isOpenCardIdModal = true
    },
    closeCardIdModal() {
      this.isOpenCardIdModal = false
    },
    openCreateWishModal() {
      this.isOpenCreateWishModal = true
    },
    closeCreateWishModal() {
      this.isOpenCreateWishModal = false
    },
  }
})