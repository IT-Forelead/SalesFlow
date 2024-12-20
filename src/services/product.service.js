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
  async sendChannel(data) {
    return AxiosService.post('/product/send-channel', data)
  }
  async updateProduct(data) {
    return AxiosService.put('/product/update', data)
  }
  async updateProductBarcode(data) {
    return AxiosService.post('/product/update-barcode', data)
  }
  async getProductStats() {
    return AxiosService.get('/product/stats')
  }
  async getBestSellerStats(data) {
    return AxiosService.post('/product/best-seller/weekly-stats', data)
  }
  async getDuplicates(page, limit) {
    return AxiosService.get(`/product/barcodes/duplicates?page=${page}&limit=${limit}`)
  }
  
  async getProductsWithMostProfit(page, limit) {
    return AxiosService.get(`/product/stats/profit?page=${page}&limit=${limit}`)
  }
  async getProductsWithMostRevenue(page, limit) {
    return AxiosService.get(`/product/stats/revenue?page=${page}&limit=${limit}`)
  }
  async getProductsWithMostSales(page, limit) {
    return AxiosService.get(`/product/stats/sales?page=${page}&limit=${limit}`)
  }
  async searchProductBarcodeByParams(data) {
    return AxiosService.post('/product/barcode-search', data)
  }
  async utilizeProduct(data) {
    return AxiosService.post('/product/utilize', data)
  }
  async uploadImage(data) {
    return AxiosService.post('/assets', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
  async getUploadedImage(assetId) {
    return AxiosService.get(`/assets/${assetId}`)
  }
  async getProductsWithoutSales(page, limit) {
    return AxiosService.get(`/product/stats/without-sales?page=${page}&limit=${limit}`)
  }
  async getVarietyStats(data) {
    return AxiosService.post('/product/stats/variety', data);
  }
  async getRecommendStats(data) {
    return AxiosService.post('/product/recommendation', data);
  }
  async hideRecommendProduct(productId) {
    return AxiosService.delete(`/product/recommendation/hide/${productId}`);
  }
  async getHiddenProducts(page, limit) {
    return AxiosService.get(`/product/recommendation/blocked?page=${page}&limit=${limit}`)
  }
  async unhideRecommendProduct(productId) {
    return AxiosService.delete(`/product/recommendation/unhide/${productId}`);
  }
  async getUnprofitableStat(data) {
    return AxiosService.post(`/product/unprofitable`, data);
  }
}

export default new ProductService()
