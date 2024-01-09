import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    isOpenSidebar: true,
    currentPage:localStorage.getItem('currentPage')|| "Overview"
  }),
  actions: {
    setCurrentPage(pageName){
      this.currentPage = pageName
      localStorage.setItem('currentPage', pageName)
    },
    toggleSidebar() {
      this.isOpenSidebar = !this.isOpenSidebar
      localStorage.setItem('so', this.isOpenSidebar)
    },
    clearStore() {
      this.isOpenSidebar = true
    }
  },
})
