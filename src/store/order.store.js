import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
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
    },
  },
})
