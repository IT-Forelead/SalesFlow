import { defineStore } from 'pinia'

export const useAgentStore = defineStore('agent', {
  state: () => ({
    agents: [],
    selectedAgent: {},
  }),
  actions: {
    setAgents(data) {
      this.agents.push(...data)
    },
    setSelectedAgent(data) {
      this.selectedAgent = data
    },
    clearStore() {
      this.agents = []
    },
  },
})
