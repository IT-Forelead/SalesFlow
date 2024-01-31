import { AxiosService } from './axios.service'

class ProductService {
  async createProduct(data) {
    return AxiosService.post('/product/add', data)
  }
  async getProducts(filter) {
    return AxiosService.post('/product', filter)
  }
  async getBarcodeProduct(barcode) {
    return AxiosService.get(`/product/barcode/${barcode}`)
  }
}

export default new ProductService()
