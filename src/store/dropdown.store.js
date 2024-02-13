import { defineStore } from 'pinia'

export const useDropdownStore = defineStore('dropdown', {
  state:()=>({
    isOpenSelectLanguage: false,
  }),
  actions: {
    openSelectLanguage() {
      this.isOpenSelectLanguage = true
    },
    closeSelectLanguage() {
      this.isOpenSelectLanguage = false
    },
  }
})