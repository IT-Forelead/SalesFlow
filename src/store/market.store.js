import { defineStore } from 'pinia'

export const useMarketStore = defineStore('market', {
  state: () => ({
    markets: [],
    selectedMarket: {},
  }),
  actions: {
    setMarkets(data) {
      this.markets.push(...data)
    },
    setSelectedMarket(data) {
      this.selectedMarket = data
    },
    clearStore() {
      this.markets = []
    },
  },
})