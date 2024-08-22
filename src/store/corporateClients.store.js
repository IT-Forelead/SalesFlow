import { defineStore } from 'pinia';

export const useCorporateClientsStore = defineStore('corporateClients', {
  state: () => ({
    corporateClients: [],
    selectedClient: {},
  }),
  actions: {
    setCorporateClients(data) {
      this.corporateClients = data;
    },
    setSelectedClient(data) {
      this.selectedClient = data
    },
    clearStore() {
      this.corporateClients = [];
    },
  },
});
