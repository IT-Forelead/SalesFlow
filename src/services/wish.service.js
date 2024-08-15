import { AxiosService } from './axios.service'

class WishService {
  async createWish(data) {
    return AxiosService.post('/wishes/create', data)
  }
  async getWishes(filter) {
    return AxiosService.post('/wishes', filter)
  }
  async updateWish(data){
    return AxiosService.put('/wishes', data)
  }
}

export default new WishService()
