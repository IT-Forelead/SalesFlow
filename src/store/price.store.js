import { defineStore } from 'pinia'

export const usePriceStore = defineStore('price', {
  state: () => ({
    prices: [],
    selectedPrice: {},
    renderkey: 0,
  }),
  actions: {
    setSelectedPrice(data) {
      this.selectedPrice = data
    },
    setTotal(data) {
      this.total = data
    },
    setPrices(data) {
      this.prices.push(...data)
    },
    clearStore() {
      this.prices = []
    },
  },
})
