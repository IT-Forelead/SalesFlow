import { AxiosService } from './axios.service'

class InvestorService {
  async createInvestor(data) {
    return AxiosService.post('/investors/create', data)
  }
  async getInvestorsByFilter(filter) {
    return AxiosService.post('/investors', filter)
  }
  async getBalances() {
    return AxiosService.get('/investors/balances')
  }
  async getBalance(id) {
    return AxiosService.get(`/investors/balance/${id}`)
  }
  async withdrawn(id) {
    return AxiosService.get(`/investors/balance/${id}/withdraw`)
  }
}

export default new InvestorService()
