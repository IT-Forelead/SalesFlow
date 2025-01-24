import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => ({
    sessions: [],
    selectedSession: {},
    renderkey: 0,
  }),
  actions: {
    setSessions(data) {
      this.sessions.push(...data)
    },
    setSelectedSession(data) {
      this.selectedSession = data
    },
    clearStore() {
      this.sessions = []
    },
  },
})