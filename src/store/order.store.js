import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    totalOrders:0,
    selectedOrder: {},
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
