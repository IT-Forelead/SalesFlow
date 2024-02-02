import { AxiosService } from './axios.service'

class ProductBarcodeService {
  async createProductBarcode(data) {
    return AxiosService.post('/productBarcode/create', data)
  }
  async getProductBarcodes() {
    return AxiosService.get('/productBarcode')
  }
}

export default new ProductBarcodeService()