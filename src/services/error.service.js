import {AxiosService} from './axios.service.js'

class ErrorService {
  async sendError(data){
    return AxiosService.post('/send-error', data)
  }
}

export default new ErrorService()