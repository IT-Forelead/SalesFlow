<script setup>
import { onClickOutside } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import i18n from '../../i18n.js'
import { useDropdownStore } from '../../store/dropdown.store'
import CaretDownIcon from '../../assets/icons/CaretDownIcon.vue'
import GlobeIcon from '../../assets/icons/GlobeIcon.vue'

const { t } = useI18n()
const dropdown = ref(null)
const currentLang = ref('')

const list = [
  {
    id: 'uz',
    name: "Uz"
  },
  {
    id: 'kr',
    name: "Ўз"
  },
  {
    id: 'ru',
    name: 'Ру'
  },
]

onClickOutside(dropdown, () => {
  useDropdownStore().closeSelectLanguage()
})

const langTranslate = (lang) => {
  if (lang === 'ru') return 'Ру'
  else if (lang === 'uz') return "Uz"
  else if (lang === 'kr') return "Ўз"
  else return "Uz"
}

const changeLang = (lang) => {
  currentLang.value = lang.name
  localStorage.setItem('lang', lang.id)
  i18n.global.locale.value = lang.id
  document.getElementsByTagName('title')[0].innerHTML = t('title')
  useDropdownStore().closeSelectLanguage()
}

onMounted(() => {
  currentLang.value = langTranslate(localStorage.getItem('lang'))
  document.getElementsByTagName('title')[0].innerHTML = t('title')
})
</script>
<template>
  <div class="relative flex-1" ref="dropdown">
    <div @click="useDropdownStore().openSelectLanguage()"
      class="flex items-center justify-between rounded-lg bg-white p-2 cursor-pointer hover:bg-gray-100">
      <div class="flex items-center space-x-1">
        <GlobeIcon class="w-5 h-5 text-gray-500" />
        <span class="text-sm">{{ currentLang }}</span>
      </div>
      <CaretDownIcon class="w-3 h-3" />
    </div>
    <ul v-if="useDropdownStore().isOpenSelectLanguage"
      class="absolute w-full bg-white shadow rounded-md z-20 bottom-12 right-0 divide-y divide-gray-200">
      <li v-for="(lang, idx) in list" :key="idx" @click="changeLang(lang)" class="hover:bg-gray-200 cursor-pointer p-2">
        {{ lang?.name }}
      </li>
    </ul>
  </div>
</template>
<style scoped></style>