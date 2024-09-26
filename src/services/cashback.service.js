import { AxiosService } from './axios.service'

class CashbackService {
  
  async getCashbacks(data) {
    return AxiosService.post('/cashback', data)
  }
  async getCustomerBalance(customerId) {
    return AxiosService.get(`/cashback/customer/balance/${customerId}`)
  }
  async getCashbackRedeems() {
    return AxiosService.get(`/cashback/stats/redeems`)
  }
}

export default new CashbackService()
