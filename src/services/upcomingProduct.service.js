import { AxiosService } from './axios.service'

class UpcomingProductService {
  async createUpcomingProduct(data) {
    return AxiosService.post('/product/upcoming', data)
  }
  async getUpcomingProducts(filter) {
    return AxiosService.post('/product/upcoming/fetch', filter)
  }
  async updateUpcomingProduct(data) {
    return AxiosService.put('/product/upcoming/update', data)
  }
}

export default new UpcomingProductService()
