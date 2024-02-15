import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    productBarcodes: [],
    selectedProduct: {}
  }),
  actions: {
    setProducts(data) {
      this.products.push(...data)
    },
    setProductBarcodes(data) {
      this.productBarcodes.push(...data)
    },
    setSelectedProduct(data) {
      this.selectedProduct = data
    },
    clearStore() {
      this.products = []
      this.productBarcodes = []
    },
  },
})
