import { defineStore } from 'pinia'

export const useMarketStore = defineStore('market', {
  state: () => ({
    markets: [],
  }),
  actions: {
    setMarkets(data) {
      this.markets.push(...data)
    },
    clearStore() {
      this.markets = []
    },
  },
})