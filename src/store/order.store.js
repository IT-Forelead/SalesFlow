import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    totalOrders:0,
    selectedOrder: {},
    currentPage: 1,
    params: {},
  }),
  actions: {
    setOrders(data) {
      this.orders.push(...data)
    },
    setSelectedOrder(data) {
      this.selectedOrder = data
    },
    clearStore() {
      this.orders = []
      this.ordersStat = []
    },
  },
})
