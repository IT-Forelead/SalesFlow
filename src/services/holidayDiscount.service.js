import { AxiosService } from './axios.service'

class HolidayDiscountService {
  async createHolidayDiscount(data) {
    return AxiosService.post('/vouchers/create', data)
  }
  async getHolidayDiscounts() {
    return AxiosService.get('/vouchers/all')
  }
  async hasDiscountToday() {
    return AxiosService.get('/vouchers')
  }
  async randomDiscount() {
    return AxiosService.get('/vouchers/random')
  }
}

export default new HolidayDiscountService()
