import { AxiosService } from './axios.service'

class AgentService {
  async createAgent(data) {
    return AxiosService.post('/agents', data)
  }
  async getAgents() {
    return AxiosService.post('/agents/search', {})
  }
  async updateAgent(data){
    return AxiosService.put('/agents', data)
  }
}

export default new AgentService()
