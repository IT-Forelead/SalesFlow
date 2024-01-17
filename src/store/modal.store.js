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
    toggleNotification() {
      this.isOpenNotification = !this.isOpenNotification
    },
    toggleProfile() {
      this.isOpenProfileDropDown = !this.isOpenProfileDropDown
    },
  }
})