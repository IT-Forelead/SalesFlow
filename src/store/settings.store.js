import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: [],
    selectedSettings: {},
  }),
  actions: {
    setSettings(data) {
      this.settings.push(...data)
    },
    setSelectedSettings(data) {
      this.selectedSettings = data
    },
    clearStore() {
      this.settings = []
    },
  },
})