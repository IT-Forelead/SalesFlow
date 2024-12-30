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
    isOpenDeleteCorporateClientModal: false,
    isOpenDebtInfoModal: false,
    isOpenUploadImageToProductModal: false,
    isOpenCreateTelegramBotModal: false,
    isOpenUtilizeProductModal: false,
    isOpenCardIdModal: false,
    isOpenCreateCorporateClientModal: false,
    isOpenClientInfoModal: false,
    isOpenDeleteCorporateClientModal: false,
    isOpenFillBalanceModal: false,
    isOpenDeleteIPBanModal: false,
    isOpenCreateInvestorModal: false,
    isOpenInvestorInfoModal: false,
    isOpenCreateInvestPlanModal: false,
    isOpenInvestDailyModal: false,
    isOpenEditInvestStatusModal: false,
    isOpenCashbackHistoryModal: false,
    isOpenCreatePriceModal: false,
    isOpenImageModal: false,
    isOpenCreateVoucherModal: false,
    isOpenAgentInfoModal: false,
    isOpenDeleteRecommendProductModal: false,
    isOpenHiddenRecommendProductsModal: false,
    isOpenUnhideRecommendProductModal: false,
    isOpenDeleteCategoryModal: false,
    isOpenCreateCategoryModal: false,
    isOpenEditCategoryModal: false,
    isOpenDeleteUnprofitableProductModal: false,
    isOpenHiddenUnprofitableProductsModal: false,
    isOpenUnhideUnprofitableProductModal: false,
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
    openDeleteCorporateClientModal() {
      this.isOpenDeleteCorporateClientModal = true
    },
    closeDeleteCorporateClientModal() {
      this.isOpenDeleteCorporateClientModal = false
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
    openCreateCorporateClientModal() {
      this.isOpenCreateCorporateClientModal = true
    },
    closeCreateCorporateClientModal() {
      this.isOpenCreateCorporateClientModal = false
    },
    openClientInfoModal() {
      this.isOpenClientInfoModal = true
    },
    closeClientInfoModal() {
      this.isOpenClientInfoModal = false
    },
    openDeleteCorporateClientModal() {
      this.isOpenDeleteCorporateClientModal = true
    },
    closeDeleteCorporateClientModal() {
      this.isOpenDeleteCorporateClientModal = false
    },
    openFillBalanceModal() {
      this.isOpenFillBalanceModal = true
    },
    closeFillBalanceModal() {
      this.isOpenFillBalanceModal = false
    },
    openDeleteIPBanModal() {
      this.isOpenDeleteIPBanModal = true
    },
    closeDeleteIPBanModal() {
      this.isOpenDeleteIPBanModal = false
    },
    openCreateInvestorModal() {
      this.isOpenCreateInvestorModal = true
    },
    closeCreateInvestorModal() {
      this.isOpenCreateInvestorModal = false
    },
    openInvestorInfoModal() {
      this.isOpenInvestorInfoModal = true
    },
    closeInvestorInfoModal() {
      this.isOpenInvestorInfoModal = false
    },
    openEditInvestStatusModal() {
      this.isOpenEditInvestStatusModal = true
    },
    closeEditInvestStatusModal() {
      this.isOpenEditInvestStatusModal = false
    },
    openInvestDailyModal() {
      this.isOpenInvestDailyModal = true
    },
    closeInvestDailyModal() {
      this.isOpenInvestDailyModal = false
    },
    openCreateInvestPlanModal() {
      this.isOpenCreateInvestPlanModal = true
    },
    closeCreateInvestPlanModal() {
      this.isOpenCreateInvestPlanModal = false
    },
    openCashbackHistoryModal() {
      this.isOpenCashbackHistoryModal = true
    },
    closeCashbackHistoryModal() {
      this.isOpenCashbackHistoryModal = false
    },
    openCreatePriceModal() {
      this.isOpenCreatePriceModal = true
    },
    closeCreatePriceModal() {
      this.isOpenCreatePriceModal = false
    },
    openImageModal() {
      this.isOpenImageModal = true
    },
    closeImageModal() {
      this.isOpenImageModal = false
    },
    openCreateVoucherModal() {
      this.isOpenCreateVoucherModal = true
    },
    closeCreateVoucherModal() {
      this.isOpenCreateVoucherModal = false
    },
    openAgentInfoModal() {
      this.isOpenAgentInfoModal = true
    },
    closeAgentInfoModal() {
      this.isOpenAgentInfoModal = false
    },
    openDeleteRecommendProductModal() {
      this.isOpenDeleteRecommendProductModal = true
    },
    closeDeleteRecommendProductModal() {
      this.isOpenDeleteRecommendProductModal = false
    },
    openHiddenRecommendProductsModal() {
      this.isOpenHiddenRecommendProductsModal = true
    },
    closeHiddenRecommendProductsModal() {
      this.isOpenHiddenRecommendProductsModal = false
    },
    openUnhideRecommendProductModal() {
      this.isOpenUnhideRecommendProductModal = true
    },
    closeUnhideRecommendProductModal() {
      this.isOpenUnhideRecommendProductModal = false
    },
    openDeleteCategoryModal() {
      this.isOpenDeleteCategoryModal = true
    },
    closeDeleteCategoryModal() {
      this.isOpenDeleteCategoryModal = false
    },
    openCreateCategoryModal() {
      this.isOpenCreateCategoryModal = true
    },
    closeCreateCategoryModal() {
      this.isOpenCreateCategoryModal = false
    },
    openEditCategoryModal() {
      this.isOpenEditCategoryModal = true
    },
    closeEditCategoryModal() {
      this.isOpenEditCategoryModal = false
    },
    openDeleteUnprofitableProductModal() {
      this.isOpenDeleteUnprofitableProductModal = true
    },
    closeDeleteUnprofitableProductModal() {
      this.isOpenDeleteUnprofitableProductModal = false
    },
    openHiddenUnprofitableProductsModal() {
      this.isOpenHiddenUnprofitableProductsModal = true
    },
    closeHiddenUnprofitableProductsModal() {
      this.isOpenHiddenUnprofitableProductsModal = false
    },
    openUnhideUnprofitableProductModal() {
      this.isOpenUnhideUnprofitableProductModal = true
    },
    closeUnhideUnprofitableProductModal() {
      this.isOpenUnhideUnprofitableProductModal = false
    }
  }
})