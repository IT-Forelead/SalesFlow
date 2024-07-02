import { AxiosService } from './axios.service'

class TelegramBotService {
  async createBot(data) {
    return AxiosService.post('/telegram/bot', data)
  }
  async getTelegramBots() {
    return AxiosService.get('/telegram/bot')
  }
  async deleteBot(id) {
    return AxiosService.delete(`/telegram/bot/${id}`)
  }
  async updateBot(data){
    return AxiosService.put('/telegram/bot', data)
  }
}

export default new TelegramBotService()
