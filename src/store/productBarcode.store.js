import { defineStore } from 'pinia'

export const useProductBarcodeStore = defineStore('productBarcode', {
  state: () => ({
    productBarcodes: [],
  }),
  actions: {
    setProductBarcodes(data) {
      this.productBarcodes.push(...data)
    },
    clearStore() {
      this.productBarcodes = []
    },
  },
})