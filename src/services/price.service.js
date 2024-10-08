import { AxiosService } from './axios.service'

class PriceService {
  async getPrices() {
    return AxiosService.post('/prices', {})
  }
  async createPrice(data) {
    return AxiosService.post('/prices/create', data)
  }
}

export default new PriceService()
