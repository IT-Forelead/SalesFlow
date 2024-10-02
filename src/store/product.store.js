import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    total:0,
    currentPage: 1,
    barcodesTotal:0,
    dublicatesTotal:0,
    productBarcodes: [],
    selectedProduct: {},
    selectedBarcodes:{},
    searchFilter:{},
    barcodeDuplicates: [],
    selectedDuplicates:{},
  }),
  actions: {
    setProducts(data) {
      this.products.push(...data)
    },
    setProductBarcodes(data) {
      this.productBarcodes.push(...data)
    },
    setBarcodeDuplicates(data) {
      this.barcodeDuplicates.push(...data)
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
    setSelectedDuplicates(data) {
      this.selectedDuplicates = data
    },
    clearStore() {
      this.products = []
      this.productBarcodes = []
      this.barcodeDuplicates = []
      this.selectedBarcodes = {}
    },
  },
})
