import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    total:0,
    barcodesTotal:0,
    productBarcodes: [],
    selectedProduct: {},
    selectedBarcodes:{},
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
    setSelectedBarcodes(data) {
      this.selectedBarcodes = data
    },
    clearStore() {
      this.products = []
      this.productBarcodes = []
    },
  },
})
