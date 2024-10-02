import { defineStore } from 'pinia'

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customers: [],
    customerHistories: [],
    selectedCustomer: {},
    renderkey: 0,
  }),
  actions: {
    setCustomers(data) {
      this.customers = data
    }, 
    setSelectedCustomer(data) {
      this.customer = data
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
