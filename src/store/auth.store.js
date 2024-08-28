import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    user: {},
    ipBans: [],
    selectedIPBan: {},
    renderkey: 0,
  }),
  actions: {
    setIPBans(data) {
      this.ipBans.push(...data)
    },
    setSelectedIPBan(data) {
      this.selectedIPBan = data
    },
    clearStore() {
      this.ipBans = []
    },
    setToken(jwt) {
      this.token = jwt
    },
    setUser(data) {
      this.user = data
    }
  },
})
