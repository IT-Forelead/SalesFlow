import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state:()=>({
    isOpenProfileDropDown: false,
    isOpenNotification: false,
    isEditProductModalOpen: false,
    isDeleteProductModalOpen: false,
  }),
  actions:{
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
    toggleNotification() {
      this.isOpenNotification = !this.isOpenNotification
    },
    toggleProfile() {
      this.isOpenProfileDropDown = !this.isOpenProfileDropDown
    },
  }
})