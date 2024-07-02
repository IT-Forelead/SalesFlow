import { defineStore } from 'pinia'

export const useTelegramBot = defineStore('bots', {
  state: () => ({
    bots: [],
    selectedBot: {},
  }),
  actions: {
    setBots(data) {
      this.bots.push(...data)
    },
    setSelectedBot(data) {
      this.selectedBot = data
    },
    clearStore() {
      this.bots = []
    },
  },
})
