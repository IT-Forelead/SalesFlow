import { defineStore } from 'pinia'

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customers: [],
    customerHistories: [],
  }),
  actions: {
    setCustomers(data) {
      this.customers = data
    }, 
    setCustomerHistories(data) {
      this.customerHistories = data
    },
    clearStore() {
      this.customers = []
      this.customerHistories = []
    },
  },
})
