import { defineStore } from 'pinia'

export const useWhiteListStore = defineStore('whiteList', {
  state: () => ({
    whiteList: [],
    selectedWhiteList: {},
    currentPage: 1,
    renderkey: 0,
    
  }),
  actions: {
    setWhiteList(data) {
      this.whiteList.push(...data)
    },
    setSelectedWhiteList(data) {
      this.selectedWhiteList = data
    },
    
    
    clearStore() {
      this.whiteList = []
      this.selectedWhiteList = {}
    },
  },
})
