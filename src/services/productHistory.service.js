import { AxiosService } from './axios.service'

class ProductHistoryService {
  async createProductHistory(data) {
    return AxiosService.post('/product/history/add', data)
  }

  async getProductHistories(filter) {
    return AxiosService.post('/product/history', filter)
  }

  async updateProductHistory(data) {
    return AxiosService.post('/product/history/update', data)
  }
}

export default new ProductHistoryService()
