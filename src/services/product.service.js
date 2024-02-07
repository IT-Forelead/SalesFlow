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
  async getBarcodes() {
    return AxiosService.get('/product/barcodes')
  }
  async updateProduct(data){
    return AxiosService.put('/product/update', data)
  }
  async getProductStats(){
    return AxiosService.get('/product/stats')
  }
} 

export default new ProductService()
