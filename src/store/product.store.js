import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    barcodes: [],
    selectedProduct: {}
  }),
  actions: {
    setProducts(data) {
      this.products.push(...data)
    },
    setBarcodess(data) {
      this.barcodes.push(...data)
    },
    setSelectedProduct(data) {
      this.selectedProduct = data
    },
    clearStore() {
      this.products = []
      this.barcodes = []
    },
  },
})
