import { AxiosService } from './axios.service'

class MarketProductService {
  async createMarketProduct(data) {
    return AxiosService.post('/market/add-product', data)
  }
  async getMarkets() {
    return AxiosService.get('/market')
  }
}

export default new MarketProductService()
