import { defineStore } from 'pinia'

export const useExpenseStore = defineStore('expense', {
  state: () => ({
    expenses: [],
    selectedExpense: {},
    renderkey: 0,
  }),
  actions: {
    setExpenses(data) {
      this.expenses.push(...data)
    },
    setSelectedExpense(data) {
      this.selectedExpense = data
    },
    clearStore() {
      this.expenses = []
    },
  },
})
