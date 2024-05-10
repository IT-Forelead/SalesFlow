import { defineStore } from 'pinia'

export const useProductHistoryStore = defineStore('productHistory', {
  state: () => ({
    productHistories: [],
    totalHistories: 0,
    currentPage: 1,
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
