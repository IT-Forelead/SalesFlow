import type { AxiosInstance } from 'axios';

declare module './axios.service' {
  export const PublicAxiosService: AxiosInstance;
  export const AxiosService: AxiosInstance;
}
