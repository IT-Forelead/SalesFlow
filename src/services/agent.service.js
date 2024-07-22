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
  async sendMessage(id){
    return AxiosService.post('/agents/send-message', id)
  }
  async sendChatMessage(data) {
    return AxiosService.post('/agents/send-chat', data)
  }
}

export default new AgentService()
