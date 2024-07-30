import { AxiosService } from './axios.service'

class CashbackService {
  
  async getCashbacks() {
    return AxiosService.post('/cashbacks/search', {})
  }

}

export default new CashbackService()
