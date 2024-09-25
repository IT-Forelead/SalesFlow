import { AxiosService } from './axios.service'

class InvestService {
  async getInvestsByFilters(filter) {
    return AxiosService.post('/invests', filter)
  }
  async getInvestDailyByFilters(filter) {
    return AxiosService.post('/invests/incomes', filter)
  }
  async changeStatus(data) {
    return AxiosService.patch('/invests', data)
  }
  async createPlan(data) {
    return AxiosService.post('/invests/plans/create', data)
  }
  async getPlans(filter) {
    return AxiosService.post(`/invests/plans`, filter)
  }
}

export default new InvestService()
