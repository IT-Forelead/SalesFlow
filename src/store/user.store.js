import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    selectedUser: {},
    renderkey: 0,
  }),
  actions: {
    setUsers(data) {
      this.users.push(...data)
    },
    setSelectedUser(data) {
      this.selectedUser = data
    },
    clearStore() {
      this.users = []
    },
  },
})
