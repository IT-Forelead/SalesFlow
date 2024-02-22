import { defineStore } from 'pinia'

export const useSaleStore = defineStore('sale', {
  state: () => ({
    sales: [],
    selectedSale: {},
  }),
  actions: {
    setSales(data) {
      this.sales.push(...data)
    },
    setSelectedSale(data) {
      this.selectedSale = data
    },
    clearStore() {
      this.sales = []
    },
  },
})