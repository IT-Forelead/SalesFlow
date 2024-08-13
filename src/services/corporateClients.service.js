import { AxiosService } from './axios.service';

class CorporateClientsService {
  async createCorporateClient(data) {
    return AxiosService.post('/corporate-clients', data);
  }

  async getCorporateClients() {
    return AxiosService.get('/corporate-clients');
  }

  async deleteCorporateClient(id) {
    return AxiosService.delete(`/corporate-clients/${id}`);
  }
}

export default new CorporateClientsService();
