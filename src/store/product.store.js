import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    recommendProducts: [],
    unprofitableProducts: [],
    recentProducts: [],
    total:0,
    currentPage: 1,
    barcodesTotal:0,
    dublicatesTotal:0,
    productBarcodes: [],
    selectedProduct: {},
    hiddenProducts: [],
    hiddenRecentProducts: [],
    hiddenUnprofitableProducts: [],
    selectedHiddenProduct: {},
    selectedBarcodes:{},
    searchFilter:{},
    barcodeDuplicates: [],
    selectedDuplicates:{},
    renderKey: 0,
    intervalType: 'month',
    limit: 20
  }),
  actions: {
    setProducts(data) {
      this.products.push(...data)
    },
    setRecommendProducts(data) {
      this.recommendProducts.push(...data)
    },
    setUnprofitableProducts(data) {
      this.unprofitableProducts.push(...data)
    },
    setRecentProducts(data) {
      this.recentProducts.push(...data)
    },
    setProductBarcodes(data) {
      this.productBarcodes.push(...data)
    },
    setHiddenProducts(data) {
      this.hiddenProducts.push(...data)
    },
    setHiddenRecentProducts(data) {
      this.hiddenProducts.push(...data)
    },
    setHiddenUnprofitableProducts(data) {
      this.hiddenProducts.push(...data)
    },
    setSelectedHiddenProduct(data) {
      this.selectedHiddenProduct = data
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
    clearHiddenProducts() {
      this.hiddenProducts = []
    },
    clearHiddenRecentProducts() {
      this.hiddenRecentProducts = []
    },
    clearRecommendProducts() {
      this.recommendProducts = []
    },

    clearUnprofitableProducts() {
      this.unprofitableProducts = []
    },
    clearRecentProducts() {
      this.recentProducts = []
    },
    clearStore() {
      
      this.products = []
      this.recommendProducts = []
      this.unprofitableProducts = []
      this.productBarcodes = []
      this.hiddenProducts = []
      this.hiddenRecentProducts = []
      this.hiddenUnprofitableProducts = []
      this.barcodeDuplicates = []
      this.selectedBarcodes = {}
      this.recentProducts = []
    },
  },
})
