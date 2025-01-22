import { defineStore } from 'pinia'

export const useWhiteListStore = defineStore('whiteList', {
  state: () => ({
    whiteList: [],
    selectedWhiteList: {},
    currentPage: 1,
    params: {},
    isFromCashback: false,
    renderkey: 0,
    
  }),
  actions: {
    setwhiteList(data) {
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
