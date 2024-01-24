import { defineStore } from 'pinia'

export const useProductHistoryStore = defineStore('productHistory', {
  state: () => ({
    productHistories: [],
    selectedProductHistory: {},
  }),
  actions: {
    setProductHistories(data) {
      this.productHistories.push(...data)
    },
    setSelectedProductHistory(data) {
      this.selectedProductHistory = data
    },
    clearStore() {
      this.productHistories = []
    },
  },
})
