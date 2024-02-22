import { AxiosService } from './axios.service'

class SaleService {
  async createSale(data) {
    return AxiosService.post('/sale/create', data)
  }
  async getSales() {
    return AxiosService.get('/sale')
  }
}

export default new SaleService()
