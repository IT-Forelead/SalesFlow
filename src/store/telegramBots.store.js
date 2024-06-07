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
    setSelectedAgent(data) {
      this.selectedBots = data
    },
    clearStore() {
      this.bots = []
    },
  },
})
