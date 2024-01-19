import { AxiosService } from './axios.service'

class ProductHistoryService {
  async createProductHistory(data) {
    return AxiosService.post('/product/add-history', data)
  }
}

export default new ProductHistoryService()
