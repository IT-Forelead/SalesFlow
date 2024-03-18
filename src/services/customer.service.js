import { AxiosService } from './axios.service'

class CustomerService {
  async createCustomer(data) {
    return AxiosService.post('/customer/create-sale', data)
  }
  async createDebt(data) {
    return AxiosService.post('/customer/create/lend-sale', data)
  }
  async getDebtors(limit, page) {
    return AxiosService.get(`/customer/lend-sales?limit=${limit}&page=${page}`)
  }
  async deleteDebtor(id) {
    return AxiosService.delete(`/customer/delete/lend-sale/${id}`)
  }
}

export default new CustomerService()