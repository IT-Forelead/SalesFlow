import { AxiosService, PublicAxiosService } from './axios.service';
import type { GeoLocation } from '@/types/common';

class OrderService {
  async createOrder(data: any) {
    return AxiosService.post('/order/create', data);
  }

  async getOrders(page: number, limit: number, filter: any) {
    return AxiosService.post(`/order?limit=${limit}&page=${page}`, filter);
  }

  async isOrderExists(orderId: string) {
    return AxiosService.get(`/order/exist/${orderId}`);
  }

  async getOrdersStat() {
    return AxiosService.get('/order/stats/week');
  }

  async getOrdersStatsFinal(data: any) {
    return AxiosService.post('/order/stats/final', data);
  }

  async getOrdersStatsOverall() {
    return AxiosService.get('/order/stats/overall');
  }

  async getCashierStats() {
    return AxiosService.get('/order/cashier-stats/week');
  }

  async getOrderById(orderId: string) {
    return AxiosService.get(`/order/${orderId}`);
  }

  async getTurnoverStats(data: any) {
    return AxiosService.post('/order/turnover/stats', data);
  }

  async refundItems(data: any) {
    return AxiosService.post('/order/refund/items', data);
  }

  async getMarketLocationByOrderId(orderId: string) {
    return PublicAxiosService.get<GeoLocation>(`/order/location/${orderId}`);
  }
}

export default new OrderService();
