import { AxiosService } from './axios.service'

class CategoryService {
  
  async getCategories() {
    return AxiosService.get('/category')
  }
  async createCategory(data) {
    return AxiosService.post('/category/create', data)
  }

  async updateCategory(data) {
    return AxiosService.post('/category/update', data)
  }

  async deleteCategory(data) {
    return AxiosService.post('/category/delete', data)
  }
}

export default new CategoryService()
