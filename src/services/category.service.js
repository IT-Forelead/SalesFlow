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
}

export default new CategoryService()
