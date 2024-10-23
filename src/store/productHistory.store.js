import { defineStore } from 'pinia'

export const useProductHistoryStore = defineStore('productHistory', {
  state: () => ({
    productHistories: [],
    totalHistories: 0,
    currentPage: 1,
    selectedProductHistory: '',
    utilizeData: {},
    sorting: [],
  }),
  actions: {
    setProductHistories(data) {
      this.productHistories.push(...data)
    },
    setSelectedProductHistory(data) {
      this.selectedProductHistory = data
    },
    setUtilizeData(id, quantity) {
      this.utilizeData = {
        id: id,
        quantity: quantity,
      }
    },
    setSorting(data) {
      this.sorting = data
    },
    clearStore() {
      this.productHistories = []
    },
  },
})
