import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state:()=>({
    isOpenProfileDropDown: false,
    isOpenNotification: false,
    isEditProductModalOpen: false,
    isDeleteProductModalOpen: false,
    isCreateUserModalOpen: false,
    isEditUserModalOpen: false,
    isDeleteUserModalOpen: false,
    isOpenOrderInfoModal: false,
    isOpenCreateMarketModal: false,
    isOpenCreateProductModal: false,
    isOpenCreateProductHistoryModal: false,
    isOpenDeleteProductHistoryModal: false,
    isOpenEditProductHistoryModal: false,
  }),
  actions:{
    openCreateUserModal() {
      this.isCreateUserModalOpen = true
    },
    closeCreateUserModal() {
      this.isCreateUserModalOpen = false
    },
    openEditUserModal() {
      this.isEditUserModalOpen = true
    },
    closeEditUserModal() {
      this.isEditUserModalOpen = false
    },
    openDeleteUserModal() {
      this.isDeleteUserModalOpen = true
    },
    closeDeleteUserModal() {
      this.isDeleteUserModalOpen = false
    },
    openEditProductModal() {
      this.isEditProductModalOpen = true
    },
    closeEditProductModal() {
      this.isEditProductModalOpen = false
    },
    openDeleteProductModal() {
      this.isDeleteProductModalOpen = true
    },
    closeDeleteProductModal() {
      this.isDeleteProductModalOpen = false
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