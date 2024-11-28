import { AxiosService } from './axios.service'

class OfferService {
  async getAllByAgent(id, limit, page) {
    return AxiosService.get(`/offer/products/${id}?limit=${limit}&page=${page}`)
  }
  async createOffer(data) {
    return AxiosService.post('/offer/create', data)
  }
  async getAllByMarket(limit, page) {
    return AxiosService.get(`/offer/all?limit=${limit}&page=${page}`)
  }
  async getOffer(id){
    return AxiosService.get(`/offer/${id}`)
  }
  async addComment(data){
    return AxiosService.post('/offer/comment', data)
  }
  async getComments(id){
    return AxiosService.get(`/offer/comment/${id}`)
  }
}

export default new OfferService()