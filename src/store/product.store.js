import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
  }),
  actions: {
    setProducts(data) {
      this.products.push(...data)
    },
    clearStore() {
      this.products = []
    },
  },
})
