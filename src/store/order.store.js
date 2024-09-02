import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    totalOrders:0,
    selectedOrder: {},
    currentPage: 1,
    params: {},
    isFromCashback: false,
    renderkey: 0,
  }),
  actions: {
    setOrders(data) {
      this.orders.push(...data)
    },
    setSelectedOrder(data) {
      this.selectedOrder = data
    },
    fromCashback(isFromCashback) {
      this.isFromCashback = isFromCashback
    },
    
    clearStore() {
      this.orders = []
      this.ordersStat = []
    },
  },
})
