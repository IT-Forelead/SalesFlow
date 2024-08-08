import { defineStore } from 'pinia'

export const useWishStore = defineStore('wish', {
  state: () => ({
    wishes: [],
    selectedWish: {},
    renderkey: 0,
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
  },
})
