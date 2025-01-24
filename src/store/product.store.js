import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    selectedProduct: {},
    selectedHiddenRecommendProduct: {},
    selectedHiddenUnprofitableProduct: {},
    selectedHiddenRecentProduct: {},
    hiddenRecommendProducts: [],
    hiddenUnprofitableProducts: [],
    hiddenRecentProducts: [],
    recommendProducts: [],
    unprofitableProducts: [],
    recentProducts: [],
    total:0,
    currentPage: 1,
    barcodesTotal:0,
    dublicatesTotal:0,
    productBarcodes: [],
    selectedBarcodes:{},
    searchFilter:{},
    barcodeDuplicates: [],
    selectedDuplicates:{},
    renderKey: 0,
    intervalType: 'month',
    limit: 20,
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

    setHiddenRecommendProducts(data) {
      this.hiddenRecommendProducts.push(...data)
    },
    setHiddenUnprofitableProducts(data) {
      this.hiddenUnprofitableProducts.push(...data)
    },
    setHiddenRecentProducts(data) {
      this.hiddenRecentProducts.push(...data)
    },
    setSelectedProduct(data) {
      this.selectedProduct = data
    },
    setSelectedHiddenRecommendProduct(data) {
      this.selectedHiddenRecommendProduct = data
    },
    setSelectedHiddenUnprofitableProduct(data) {
      this.selectedHiddenUnprofitableProduct = data
    },
    setSelectedHiddenRecentProduct(data) {
      this.selectedHiddenRecentProduct = data
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
    clearHiddenRecommendProducts() {
      this.hiddenRecommendProducts = []
    },
    clearHiddenUnprofitableProducts() {
      this.hiddenUnprofitableProducts = []
    },
    clearHiddenRecentProducts() {
      this.hiddenRecentProducts = []
    },
    setProductBarcodes(data) {
      this.productBarcodes.push(...data)
    },
    setBarcodeDuplicates(data) {
      this.barcodeDuplicates.push(...data)
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
      this.unprofitableProducts = []
      this.recentProducts = []
      this.hiddenRecommendProducts = []
      this.hiddenUnprofitableProducts = []
      this.hiddenRecentProducts = []
      this.productBarcodes = []
      this.barcodeDuplicates = []
      this.selectedBarcodes = {}
    },
  },
})
