import { PublicAxiosService, AxiosService } from "./axios.service"
class AuthService {
  async login(user) {
    await PublicAxiosService
      .post('/auth/user/login', {
        phone: user.phone.replace(/([() -])/g, ''),
        password: user.password,
      })
      .then((res) => {
        localStorage.setItem('session', JSON.stringify(res?.data))
      })
    return JSON.parse(localStorage.getItem('session'))
  }

  async resetPassword(phone) {
    let parsedPhone = phone.replace(/([() -])/g, '')
    await PublicAxiosService.get(`/auth/reset-password?phone=${encodeURIComponent(parsedPhone)}`)
  }

  async linkValidationAndUpdatePassword(data) {
    await PublicAxiosService.post('/auth/link-validation-and-update-password', data)
  }

  async linkValidation(linkCode) {
    await PublicAxiosService.get(`/auth/link-validation/${linkCode}`)
  }
  
  async logout() {
    await AxiosService.get('/auth/user/logout').then(() => {
      localStorage.clear()
    })
    localStorage.clear()
  }
}

export default new AuthService()
