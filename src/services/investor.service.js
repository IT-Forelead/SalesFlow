import { AxiosService } from './axios.service'

class InvestorService {
  async createInvestor(data) {
    return AxiosService.post('/investor/create', data)
  }
  async getInvestors() {
    return AxiosService.get('/investors/balances')
  }
  async getInvestor(id) {
    return AxiosService.get(`/investors/balance/${id}`)
  }
  async withdrawn(id) {
    return AxiosService.get(`/investors/balance/${id}/withdraw`)
  }
  async getByFilters(filters) {
    return AxiosService.post('/investors', filter)
  }
}

export default new InvestorService()
