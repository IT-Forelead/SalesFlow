import { defineStore } from 'pinia'

export const useInvestStore = defineStore('invest', {
  state: () => ({
    invests: [],
    investDaily: [],
    selectedInvest: {},
    investPlans: [],
    selectedInvestPlan: {},
    renderkey: 0,
  }),
  actions: {
    setInvests(data) {
      this.invests.push(...data)
    },
    setInvestDaily(data) {
      this.investDaily.push(...data)
    },
    setSelectedInvest(data) {
      this.selectedInvest = data
    },
    setInvestPlans(data) {
      this.investPlans.push(...data)
    },
    setSelectedInvestPlan(data) {
      this.selectedInvestPlan = data
    },
    clearStore() {
      this.invests = [],
      this.investDaily = [],
      this.investPlans = []
      this.selectedInvest = {}
    },
  },
},)
