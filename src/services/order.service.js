import { AxiosService } from './axios.service'

class OrderService {
  async createOrder(data) {
    return AxiosService.post('/order/create', data)
  }
  async getOrders() {
    return AxiosService.get('/order')
  }
  async getOrdersStat() {
    return AxiosService.get('/order/stats/week')
  }
  async getOrdersStatsFinal(data) {
    return AxiosService.post('/order/stats/final', data)
  }
  async getCashierStats() {
    return AxiosService.get('/order/cashier-stats/week')
  }
}

export default new OrderService()
