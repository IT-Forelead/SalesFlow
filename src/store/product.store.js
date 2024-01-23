import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    selectProduct: ''
  }),
  actions: {
    setProducts(data) {
      this.products.push(...data)
    },
    clearStore() {
      this.products = []
    },
    setSelectProduct(data) {
      this.selectProduct = data
    },
  },
})
