import { defineStore } from 'pinia'

export const useDropdownStore = defineStore('dropdown', {
  state:()=>({
    selectOptionAgent: '',
    isOpenAgentDropdown: false,
    isOpenSelectLanguage: false,
    isOpenFilterBy: false,
    isOpenSortBy: false,
    isOpenSelectTheme: false,

    isOpenVarietyFilterBy: false,
    isOpenMonthFilterBy: false,
    isOpenPredictFilterBy: false,
    isOpenRecommendFilterBy: false,

    isOpenUnprofitableFilterBy: false,
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
    toggleSortBy() {
      this.isOpenSortBy = !this.isOpenSortBy
    },
    openSelectTheme() {
      this.isOpenSelectTheme = true
    },
    closeSelectTheme() {
      this.isOpenSelectTheme = false
    },

    toggleVarietyFilterBy() {
      this.isOpenVarietyFilterBy = !this.isOpenVarietyFilterBy
    },
    togglePredictFilterBy() {
      this.isOpenPredictFilterBy = !this.isOpenPredictFilterBy
    },
    toggleMonthFilterBy() {
      this.isOpenMonthFilterBy = !this.isOpenMonthFilterBy
    },
    toggleRecommendFilterBy() {
      this.isOpenRecommendFilterBy = !this.isOpenRecommendFilterBy
    },
    toggleUnprofitableFilterBy() {
      this.isOpenUnprofitableFilterBy = !this.isOpenUnprofitableFilterBy
    },
  }
})
