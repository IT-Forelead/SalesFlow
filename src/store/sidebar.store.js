import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    isOpenSidebar: JSON.parse(localStorage.getItem('isOpenSidebar')) || false,
  }),
  actions: {
    toggleSidebar(isOpen) {
      this.isOpenSidebar = isOpen;
      localStorage.setItem('isOpenSidebar', JSON.stringify(this.isOpenSidebar));
    },
    setSidebarState(isOpen) {
      this.isOpenSidebar = isOpen;
      localStorage.setItem('isOpenSidebar', JSON.stringify(this.isOpenSidebar));
    }
  }
});
