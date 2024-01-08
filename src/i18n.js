import { createI18n } from 'vue-i18n'
import en from './assets/lang/english.json'
import ru from './assets/lang/russian.json'
import uz from './assets/lang/uzbek.json'
import kr from './assets/lang/krill.json'

export default createI18n({
  legacy: false,
  globalInjection: true,
  allowComposition: true,
  globals: true,
  locale: localStorage.getItem('lang') || 'uz',
  messages: {
    en: en,
    ru: ru,
    uz: uz,
    kr: kr,
  },
})
