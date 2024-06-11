import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    total:0,
    currentPage: 1,
    barcodesTotal:0,
    productBarcodes: [],
    selectedProduct: {},
    selectedBarcodes:{},
    searchFilter:{},
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
    setSearchFilter(data) {
      this.searchFilter = data
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
