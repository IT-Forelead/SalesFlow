import { defineStore } from 'pinia'

export const useUpcomingProductStore = defineStore('upcomingProduct', {
  state: () => ({
    upcomingProducts: [],
    total:0,
    currentPage: 1,
  }),
  actions: {
    setUpcomingProducts(data) {
      this.upcomingProducts.push(...data)
    },
    setTotal(data) {
      this.total = data
    },
    setCurrentPage(data) {
      this.currentPage = data
    },
    clearStore() {
      this.upcomingProducts = []
    },
  },
})
