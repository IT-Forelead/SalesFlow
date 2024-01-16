import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    user: {}
  }),
  actions: {
    setToken(jwt) {
      this.token = jwt
    },
    setUser(data) {
      this.user = data
    }
  },
})
