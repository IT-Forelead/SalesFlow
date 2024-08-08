import { AxiosService } from './axios.service'

class WishService {
  async createWish(data) {
    return AxiosService.post('/wishes', data)
  }
  async getWishes() {
    return AxiosService.post('/wishes', {})
  }
  async updateWish(data){
    return AxiosService.put('/wishes', data)
  }
}

export default new WishService()
