import { AxiosService } from './axios.service'

class ExpenseService {
  
  async getExpenses(data) {
    return AxiosService.post('/expenses/all', data)
  }
  async createExpense(data) {
    return AxiosService.post('/expenses/create', data)
  }

  async updateExpense(data) {
    return AxiosService.put('/expenses/update', data)
  }

  async deleteExpense(id) {
    return AxiosService.delete(`/expenses/delete/${id}`)
  }
}

export default new ExpenseService()
