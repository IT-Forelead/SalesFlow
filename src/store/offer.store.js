import { defineStore } from 'pinia'

export const useOfferProductStore = defineStore('offerProduct', {
  state: () => ({
    offerProducts: [],
    selectedOfferProduct: {},
    total:0,
    currentPage: 1,
  }),
  actions: {
    setOfferProducts(data) {
      this.offerProducts.push(...data)
    },
    setSelectedOfferProduct(data) {
      this.selectedOfferProduct = data
    },
    setTotal(data) {
      this.total = data
    },
    setCurrentPage(data) {
      this.currentPage = data
    },
    clearStore() {
      this.offerProducts = []
    },
  },
})
