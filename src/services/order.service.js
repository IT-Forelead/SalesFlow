import { AxiosService } from './axios.service'

class OrderService {
  async createOrder(data) {
    return AxiosService.post('/order/create', data)
  }
  async getOrders() {
    return AxiosService.get('/order')
  }
}

export default new OrderService()
