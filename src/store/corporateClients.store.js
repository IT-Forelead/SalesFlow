import { defineStore } from 'pinia';

export const useCorporateClientsStore = defineStore('corporateClients', {
  state: () => ({
    corporateClients: [],
  }),
  actions: {
    setCorporateClients(data) {
      this.corporateClients = data;
    },
    clearStore() {
      this.corporateClients = [];
    },
  },
});
