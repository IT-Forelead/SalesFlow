import { AxiosService } from './axios.service'

class UserService {
  async createUser(data) {
    return AxiosService.post('/user/create', data)
  }
  async getUsers() {
    return AxiosService.get('/user')
  }

  async updateUser(data){
    return AxiosService.put('/user/update', data)
  }
}

export default new UserService()
