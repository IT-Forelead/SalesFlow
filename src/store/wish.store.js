import { defineStore } from 'pinia'

export const useWishStore = defineStore('wish', {
  state: () => ({
    wishes: [],
    selectedWish: {},
    renderkey: 0,
    totalWishes: 0,
    currentPage: 1,
    updateWish: false,
  }),
  actions: {
    setWishes(data) {
      this.wishes.push(...data)
    },
    setSelectedWish(data) {
      this.selectedWish = data
    },
    clearStore() {
      this.wishes = []
    },
    updateWish() {
      this.wishes.push(...data)
    },
  },
})
