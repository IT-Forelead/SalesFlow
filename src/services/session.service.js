import { AxiosService } from './axios.service'

class SessionService {
  
  async getAllSessions(filter) {
    return AxiosService.post(`/sessions/all`, filter);
  }
}

export default new SessionService()
