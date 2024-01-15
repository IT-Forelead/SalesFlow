import { AxiosService } from './axios.service'

class UserService {
  async createUser(data) {
    return AxiosService.post('/user/create', data)
  }
  async getUsers() {
    return AxiosService.get('/user')
  }
}

export default new UserService()
