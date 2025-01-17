import { AxiosService } from './axios.service'

class ExpenseService {
  
  async createExpense(data) {
    return AxiosService.post('/expenses/create', data)
  }
  async updateExpense(data) {
    return AxiosService.put('/expenses/update', data)
  }
  async statsExpense(data) {
    return AxiosService.post('/expenses/stats', data)
  }
  async infoExpense(data) {
    return AxiosService.post('/expenses/info', data)
  }
  async getExpenses(data) {
    return AxiosService.post('/expenses/all', data)
  }
}

export default new ExpenseService()
