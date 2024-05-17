import { defineStore } from 'pinia'

export const useDropdownStore = defineStore('dropdown', {
  state:()=>({
    selectOptionAgent: '',
    isOpenAgentDropdown: false,
    isOpenSelectLanguage: false,
    isOpenFilterBy: false,
  }),
  actions: {
    setSelectOptionAgent(data) {
      this.selectOptionAgent = data
    },
    openAgentDropdown() {
      this.isOpenAgentDropdown = true
    },
    closeAgentDropdown() {
      this.isOpenAgentDropdown = false
    },
    openSelectLanguage() {
      this.isOpenSelectLanguage = true
    },
    closeSelectLanguage() {
      this.isOpenSelectLanguage = false
    },
    toggleFilterBy() {
      this.isOpenFilterBy = !this.isOpenFilterBy
    },
  }
})