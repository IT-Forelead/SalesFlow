import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    recommendProducts: [],
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
    renderKey: 0,
    intervalType: 'month',
    limit: 7
  }),
  actions: {
    setProducts(data) {
      this.products.push(...data)
    },
    setRecommendProducts(data) {
      this.recommendProducts.push(...data)
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
    setLimit(data) {
      this.limit = data
    },
    setIntervalType(data) {
      this.intervalType = data
    },
    clearStore() {
      
      this.products = []
      this.recommendProducts = []
      this.productBarcodes = []
      this.barcodeDuplicates = []
      this.selectedBarcodes = {}
    },
  },
})
