import { defineStore } from 'pinia'

export const useHolidayDiscount = defineStore('holidayDiscount', {
  state: () => ({
    holidayDiscounts: [],
    selectedHolidayDiscount: {},
  }),
  actions: {
    setHolidayDiscounts(data) {
      this.holidayDiscounts.push(...data)
    },
    setSelectedHolidayDiscount(data) {
      this.selectedHolidayDiscount = data
    },
    clearStore() {
      this.holidayDiscounts = []
    },
  },
})
