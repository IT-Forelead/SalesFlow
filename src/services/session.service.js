
import { AxiosService } from './axios.service'

class SessionService {
  
  async getAllSessions() {
    return AxiosService.post(`/sessions/all`);
}
}

export default new SessionService()
