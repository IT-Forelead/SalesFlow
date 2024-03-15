import { defineStore } from 'pinia'

export const useDebtorStore = defineStore('debtors', {
  state: () => ({
    debtors: [],
    totalDebtors:0,
    selectedDebtor: {},
  }),
  actions: {
    setDebtors(data) {
      this.debtors.push(...data)
    },
    setSelectedDebtor(data) {
      this.selectedDebtor = data
    },
    clearStore() {
      this.debtors = []
    },
  },
})
