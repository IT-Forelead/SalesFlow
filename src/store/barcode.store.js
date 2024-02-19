import { defineStore } from 'pinia'

export const useBarcodeStore = defineStore('barcode', {
  state: () => ({
    decodedBarcode: '',
  }),
  actions: {
    setDecodedBarcode(data) {
      this.decodedBarcode = data
    },
    clearStore() {
      this.decodedBarcode = ''
    },
  },
})
