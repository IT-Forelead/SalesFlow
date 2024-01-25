import { AxiosService } from './axios.service'

class OrderService {
  async createOrder(data) {
    return AxiosService.post('/order/create', data)
  }
}

export default new OrderService()
