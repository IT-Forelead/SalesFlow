import axios from 'axios'
import { refreshToken } from '../mixins/refresh.token.js'

// axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
// axios.defaults.withCredentials = true

export const PublicAxiosService = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})

const Axios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})


/* ALL AXIOS REQUESTS */
Axios.interceptors.request.use(
  async (config) => {
    const session = JSON.parse(localStorage.getItem('session'))
    if (session?.accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${session?.accessToken}`,
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

/* ALL AXIOS RESPONSES */
Axios.interceptors.response.use(
  (response) => response?.data,
  async (error) => {
    const config = error?.config
    if (error?.response?.status === 403 && !config?.sent) {
      config.sent = true

      const result = await refreshToken()
      if (result?.accessToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${result?.accessToken}`,
        }
      }
      let res = await axios(config)
      return res?.data
    }
    return Promise.reject(error)
  }
)

export const AxiosService = Axios