import { defineStore } from 'pinia'

export const useHolidayDiscount = defineStore('holidayDiscount', {
  state: () => ({
    holidayDiscounts: [],
    discount:{},
    totalPrice: 0,
    selectedHolidayDiscount: {},
  }),
  actions: {
    setHolidayDiscounts(data) {
      this.holidayDiscounts.push(...data)
    },
    setDiscount(data) {
      this.discount = data
    },
    setSelectedHolidayDiscount(data) {
      this.selectedHolidayDiscount = data
    },
    clearStore() {
      this.holidayDiscounts = []
    },
    clearDiscountStore() {
      this.discount = {}
    },
  },
})
