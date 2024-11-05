import { AxiosService } from './axios.service'

class VoucherService {
  async createVoucher(data) {
    return AxiosService.post('/voucher/add', data)
  }
  async getAllVouchers(limit, page) {
    return AxiosService.get(`/voucher/all?limit=${limit}&page=${page}`)
  }
}

export default new VoucherService()
