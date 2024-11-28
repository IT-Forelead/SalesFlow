import { PublicAxiosService, AxiosService } from "./axios.service"
class AuthService {
  async login(user) {
    await PublicAxiosService
      .post('/auth/login', {
        login: user.login,
        password: user.password,
      })
      .then((res) => {
        localStorage.setItem('session', JSON.stringify(res?.data))
      })
    return JSON.parse(localStorage.getItem('session'))
  }
  
  async logout(action) {
    await AxiosService.get('/auth/logout').then(() => {
      localStorage.removeItem('session');
      localStorage.removeItem('authToken');
      action()
    })
    localStorage.removeItem('session');
    localStorage.removeItem('authToken');
  }
  async getIPBans() {
    return AxiosService.get('/auth/ip-bans')
  }
  async getIPBan(ip){
    return AxiosService.get(`/auth/ip-bans/${ip}`)
  }
  async deleteIPBan(ip){
    return AxiosService.delete(`/auth/ip-bans/${ip}`)
  }
}

export default new AuthService()
