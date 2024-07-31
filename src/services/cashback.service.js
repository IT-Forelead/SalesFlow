import { AxiosService } from './axios.service'

class CashbackService {
  
  async getCashbacks() {
    return AxiosService.post('/cashback', {})
  }

  async getCustomerBalance(customerId) {
    return AxiosService.get(`/cashback/customer/balance/${customerId}`)
  }

}

export default new CashbackService()
