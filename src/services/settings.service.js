import { AxiosService } from './axios.service'

class SettingsService {
  async getSettings() {
    return AxiosService.get('/settings')
  }
  async updateSettings(data) {
    return AxiosService.post('/settings/update', data)
  }
}

export default new SettingsService()

