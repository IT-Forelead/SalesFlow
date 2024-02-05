import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    ordersStat: [],
    selectedOrder: {},
  }),
  actions: {
    setOrders(data) {
      this.orders.push(...data)
    },
    setOrdersStat(data) {
      this.ordersStat.push(...data)
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
