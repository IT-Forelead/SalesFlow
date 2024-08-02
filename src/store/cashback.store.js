import { defineStore } from 'pinia'

export const useCashbackStore = defineStore('cashback', {
  state: () => ({
    cashbacks: [],
    selectedCashback: {},
  }),
  actions: {
    setCashbacks(data) {
      this.cashbacks.push(...data)
    },
    setSelectedCashback(data) {
      this.selectedCashback = data
    },
    clearStore() {
      this.cashbacks = []
    },
  },
})
