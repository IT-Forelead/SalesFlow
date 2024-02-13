import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state:()=>({
    isOpenProfileDropDown: false,
    isOpenNotification: false,
    isOpenEditProductModal: false,
    isOpenDeleteProductModal: false,
    isOpenCreateBarcodeModal: false,
    isOpenCreateUserModal: false,
    isOpenEditUserModal: false,
    isOpenDeleteUserModal: false,
    isOpenOrderInfoModal: false,
    isOpenCreateMarketModal: false,
    isOpenEditMarketModal: false,
    isOpenDeleteMarketModal: false,
    isOpenCreateProductModal: false,
    isOpenCreateProductHistoryModal: false,
    isOpenDeleteProductHistoryModal: false,
    isOpenEditProductHistoryModal: false,
  }),
  actions: {
    openCreateBarcodeModal() {
      this.isOpenCreateBarcodeModal = true
    },
    closeCreateBarcodeModal() {
      this.isOpenCreateBarcodeModal = false
    },
    openCreateUserModal() {
      this.isOpenCreateUserModal = true
    },
    closeCreateUserModal() {
      this.isOpenCreateUserModal = false
    },
    openEditUserModal() {
      this.isOpenEditUserModal = true
    },
    closeEditUserModal() {
      this.isOpenEditUserModal = false
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
    toggleNotification() {
      this.isOpenNotification = !this.isOpenNotification
    },
    toggleProfile() {
      this.isOpenProfileDropDown = !this.isOpenProfileDropDown
    },
  }
})