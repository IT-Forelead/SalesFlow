import { AxiosService } from './axios.service'

class MarketService {
  async createMarket(data) {
    return AxiosService.post('/market/create', data)
  }
  async getMarkets() {
    return AxiosService.get('/market')
  }
}

export default new MarketService()
