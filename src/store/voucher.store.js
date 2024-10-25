import { defineStore } from 'pinia'

export const useVoucherStore = defineStore('voucher', {
  state: () => ({
    vouchers: [],
    selectedVoucher: {},
    vouchersTotal:0,
    renderkey: 0,
  }),
  actions: {
    setVouchers(data) {
      this.vouchers.push(...data)
    },
    setSelectedVoucher(data) {
      this.selectedVoucher = data
    },
    clearStore() {
      this.vouchers = []
    },
  },
})