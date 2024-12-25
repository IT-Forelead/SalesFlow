import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    selectedCategory: {},
    renderkey: 0,
  }),
  actions: {
    setCategories(data) {
      this.categories.push(...data)
    },
    setSelectedCategory(data) {
      this.selectedCategory = data
    },
    clearStore() {
      this.categories = []
    },
  },
})
