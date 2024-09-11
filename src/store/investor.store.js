import { defineStore } from 'pinia'

export const useInvestorStore = defineStore('investor', {
  state: () => ({
    investors: [],
    selectedInvestor: {},
    renderkey: 0,
  }),
  actions: {
    setInvestors(data) {
      this.investors.push(...data)
    },
    setSelectedInvestor(data) {
      this.selectedInvestor = data
    },
    clearStore() {
      this.investors = []
    },
  },
})
