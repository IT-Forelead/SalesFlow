import { AxiosService } from './axios.service'

class InvestService {
  async getByFilters(filters) {
    return AxiosService.post('/invest/create', filters)
  }
  async changeInvest(data) {
    return AxiosService.patch('/invest/create', data)
  }
  async getInvests() {
    return AxiosService.post('/invests/plans/create')
  }
  async getInvest(id) {
    return AxiosService.post(`/invests/plans`)
  }
}

export default new InvestService()
