import { defineStore } from 'pinia'

export const useWhiteListStore = defineStore('whiteList', {
  state: () => ({
    whiteList: [],
    totalOrders:0,
    selectedOrder: {},
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
      this.orders = []
      this.ordersStat = []
    },
  },
})
