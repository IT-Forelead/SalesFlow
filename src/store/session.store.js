import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => ({
    allSession: [],
    total:0,
    currentPage: 1,
    searchFilter:{},
    renderKey: 0,
    intervalType: 'month',
    limit: 20,
    date: new Date()
  }),
  actions: {
  
    setAllSession() {
      this.allSession = []
    },

    clearStore() {
      this.allSession = []
    },
  },
})
