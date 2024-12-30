import { AxiosService } from './axios.service'

class CategoryService {
  
  async getCategories() {
    return AxiosService.get('/category')
  }
  async createCategory(data) {
    return AxiosService.post('/category/create', data)
  }

  async updateCategory(data) {
    return AxiosService.put('/category/update', data)
  }

  async deleteCategory(id) {
    return AxiosService.get(`/category/delete/${id}`)
  }
  async joinCategory(data) {
    return AxiosService.post(`/category/join`, data)
  }
}

export default new CategoryService()
