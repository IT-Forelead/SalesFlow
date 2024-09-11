import { defineStore } from 'pinia'

export const useInvestStore = defineStore('invest', {
  state: () => ({
    invests: [],
    selectedInvest: {},
    renderkey: 0,
  }),
  actions: {
    setInvests(data) {
      this.invests.push(...data)
    },
    setSelectedInvest(data) {
      this.selectedInvest = data
    },
    clearStore() {
      this.invests = []
    },
  },
})
