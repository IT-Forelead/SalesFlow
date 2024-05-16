import { AxiosService } from './axios.service'

class ProductService {
  async createProduct(data) {
    return AxiosService.post('/product/add', data)
  }
  async deleteProduct(id) {
    return AxiosService.delete(`/product/${id}`)
  }
  async createLabel(data) {
    return AxiosService.post('/product/label/create', data)
  }
  async getProducts(filter) {
    return AxiosService.post('/product', filter)
  }
  async getProductsDetails(filter) {
    return AxiosService.post('/product/details', filter)
  }
  async getBarcodeProductByFilter(filter) {
    return AxiosService.post('/product/barcodes', filter)
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
  async searchProductBarcodeByParams(data){
    return AxiosService.post('/product/barcode-search', data)
  }
}

export default new ProductService()
