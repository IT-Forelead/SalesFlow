import { defineStore } from 'pinia';
import ProductService from '@/services/product.service.js';
import { cleanObjectEmptyFields } from '@/mixins/utils.js';

export const useProductHistoryStore = defineStore('productHistory', {
  state: () => ({
    productHistories: [],
    totalHistories: 0,
    currentPage: 1,
    selectedProductHistory: '',
    utilizeData: {},
    isLoading: false,
  }),
  actions: {
    setProductHistories(data) {
      this.productHistories.push(...data)
    },
    setSelectedProductHistory(data) {
      this.selectedProductHistory = data
    },
    setUtilizeData(id, quantity) {
      this.utilizeData = {
        id: id,
        quantity: quantity,
      }
    },
    clearStore() {
      this.productHistories = []
    },
    async getProductHistories(filters = {}) {
      this.isLoading = true;
      try {
        const res = await ProductService.getProductsDetails(
          cleanObjectEmptyFields({ limit: 50, page: this.currentPage, ...filters })
        );
        this.clearStore();
        this.totalHistories = res.total;
        this.setProductHistories(res.data);
      } finally {
        this.isLoading = false;
      }
    },
  },
})
