import { AxiosService } from './axios.service'

class CustomerService {
  async createCustomer(data) {
    return AxiosService.post('/customer/create-sale', data)
  }
  async createDebt(data) {
    return AxiosService.post('/customer/create/lend-sale', data)
  }
}

export default new CustomerService()