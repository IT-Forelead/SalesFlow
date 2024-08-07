import { defineStore } from 'pinia'

export const useAgentStore = defineStore('agent', {
  state: () => ({
    agents: [],
    selectedAgent: {},
    renderkey: 0,
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
