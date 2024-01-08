import { PublicAxiosService } from "../services/axios.service"

export async function refreshToken() {
  const oldSession = JSON.parse(localStorage.getItem('session'))
  try {
    /* REFRESH TOKEN REQUEST */
    const response = await PublicAxiosService.get('/auth/user/refresh', {
      headers: {
        Authorization: `Bearer ${oldSession?.refreshToken}`,
      },
    })

    const session = response?.data
    if (!session?.accessToken) {
      localStorage.removeItem('session')
      localStorage.removeItem('user')
    }

    localStorage.setItem('session', JSON.stringify(session))

    return session
  } catch (error) {
    if (error?.response?.status === 403) {
      alert("Your session has been expired!")
      localStorage.removeItem('session')
      localStorage.removeItem('user')
      window.location.reload()
    }
  }
}
