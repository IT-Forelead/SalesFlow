import { AxiosService } from './axios.service'

class WhiteListService {
  async getWhiteList(limit, page) {
    return AxiosService.get(`/ip/all?limit=${limit}&page=${page}`)
  }

  async addWhiteList(data) {
    return AxiosService.post(`/id/add`, data)
  }

  async updateWhiteList(data) {
    return AxiosService.put(`/ip/update`, data)
  }
  async deleteWhiteList(id) {
    return AxiosService.delete(`/ip/${id}`)
  }
}

export default new WhiteListService()
