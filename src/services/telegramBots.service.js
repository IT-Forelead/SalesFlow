import { AxiosService } from './axios.service'

class TelegramBotService {
  async createBot(data) {
    return AxiosService.post('/telegram/bot', data)
  }
  async getTelegramBots() {
    return AxiosService.get('/telegram/bot')
  }
}

export default new TelegramBotService()
