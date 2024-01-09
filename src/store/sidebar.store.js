import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    isOpenSidebar: true,
  }),
  actions: {
    toggleSidebar() {
      this.isOpenSidebar = !this.isOpenSidebar
      localStorage.setItem('so', this.isOpenSidebar)
    },
    clearStore() {
      this.isOpenSidebar = true
    }
  },
})
