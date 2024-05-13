import { AxiosService } from './axios.service'

class OrderService {
  async createOrder(data) {
    return AxiosService.post('/order/create', data)
  }
  async getOrders(page, limit, data) {
    return AxiosService.post(`/order?limit=${limit}&page=${page}`, data)
  }
  async isOrderExists(orderId) {
    return AxiosService.get(`/order/exist/${orderId}`)
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
  async getOrderById(orderId) {
    return AxiosService.get(`/order/${orderId}`)
  }
}

export default new OrderService()
