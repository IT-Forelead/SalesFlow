import { defineStore } from 'pinia'

export const useAgentStore = defineStore('agent', {
  state: () => ({
    agents: [],
    agentsProducts: [],
    selectedAgent: {},
    renderkey: 0,
  }),
  actions: {
    setAgents(data) {
      this.agents.push(...data)
    },
    setAgentsProducts(data) {
      this.agentsProducts.push(...data)
    },
    setSelectedAgent(data) {
      this.selectedAgent = data
    },
    clearStore() {
      this.agents = []
    },
  },
})
