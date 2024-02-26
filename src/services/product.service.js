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
  async getBarcodeProductByName(str) {
    return AxiosService.get(`/product/barcode-by-name/${str}`)
  }
  async getBarcodes(limit, page) {
    return AxiosService.get(`/product/barcodes?limit=${limit}&page=${page}`)
  }
  async createProductBarcode(data) {
    return AxiosService.post('/product/add-barcode', data)
  }
  async updateProduct(data){
    return AxiosService.put('/product/update', data)
  }
  async updateProductBarcode(data){
    return AxiosService.post('/product/update-barcode', data)
  }
  async getProductStats(){
    return AxiosService.get('/product/stats')
  }
  async getBestSellerStats(data){
    return AxiosService.post('/product/best-seller/weekly-stats', data)
  }
}

export default new ProductService()
