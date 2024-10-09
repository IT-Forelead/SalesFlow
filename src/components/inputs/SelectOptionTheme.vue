<script setup>
import { onClickOutside } from '@vueuse/core'
import { onMounted, ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import i18n from '../../i18n.js'
import { useDropdownStore } from '../../store/dropdown.store'
import CaretDownIcon from '../../assets/icons/CaretDownIcon.vue'
import SunIcon from '../../assets/icons/SunIcon.vue'
import MoonIcon from '../../assets/icons/MoonIcon.vue'

const { t } = useI18n()
const dropdown = ref(null)
const currentTheme = ref(localStorage.getItem('theme') || 'dark')

const list = [
  {
    id: 'light',
    name: 'Light',
    icon: SunIcon,
  },
  {
    id: 'dark',
    name: 'Dark',
    icon: MoonIcon,
  },
]

const currentThemeIcon = computed(() => {
  const theme = list.find((item) => item.id === currentTheme.value)
  return theme ? theme.icon : null
})

onClickOutside(dropdown, () => {
  useDropdownStore().closeSelectTheme()
})

const themeTranslate = (theme) => {
  if (theme === 'light') return 'Light'
  else if (theme === 'dark') return 'Dark'
  else return 'Dark'
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const changeTheme = (theme) => {
  console.log(theme);
  currentTheme.value = theme.id
  console.log('1');

  localStorage.setItem('theme', theme.id)
  console.log('2');

  // i18n.global.locale.value = theme.id
  console.log('3');
  console.log(t('title'));

  // document.getElementsByTagName('title')[0].innerHTML = t('title')
  console.log('4');
  useDropdownStore().closeSelectTheme()
  console.log('5');
  var x = document.getElementById('app');
  if (x.classList.contains('dark')) {
    x.classList.remove('dark');
  } else {
    x.classList.remove('light');
  }  
  x.classList.add(theme.id);
 
}

watch(currentTheme, (newValue) => {
  const theme = list.find((item) => item.id === newValue)
 // document.getElementById('app').className = theme ? theme.id : 'dark'
  document.documentElement.className = theme ? theme.id : 'dark'
})

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const defaultTheme = list.find((theme) => theme.id === savedTheme)
  currentTheme.value = defaultTheme ? defaultTheme.id : 'dark'
 // document.getElementsByTagName('title')[0].innerHTML = t('title')
  const theme = list.find((item) => item.id === currentTheme.value)
  document.documentElement.className = theme ? theme.id : 'dark'
 // document.getElementById('app').className = theme ? theme.id : 'dark'
})
</script>

<template>
  <div class="relative flex-1" ref="dropdown">
    <div
      @click="useDropdownStore().openSelectTheme()"
      class="flex items-center justify-between rounded-lg dark:bg-slate-600 dark:bg-gray-700 p-2 dark:text-white cursor-pointer hover:bg-gray-100"
    >
      <div class="flex items-center space-x-1">
        <component :is="currentThemeIcon" class="w-5 h-5 dark:text-white" />
        <span class="text-sm">{{ capitalizeFirstLetter(currentTheme) }}</span>
      </div>
      <CaretDownIcon class="w-3 h-3" />
    </div>
    <ul
      v-if="useDropdownStore().isOpenSelectTheme"
      class="absolute w-full dark:bg-slate-600 dark:bg-gray-700 dark:text-white shadow rounded-md z-20 bottom-12 right-0 divide-y divide-gray-200"
    >
      <li
        v-for="(theme, idx) in list"
        :key="idx"
        @click="changeTheme(theme)"
        class="hover:bg-gray-200 dark:hover:bg-gray-500 cursor-pointer p-2 flex items-center space-x-2"
      >
        <component :is="theme.icon" class="w-5 h-5 text-gray-500 dark:text-white" />
        <span class="text-sm">{{ theme.name }}</span>
      </li>
    </ul>
  </div>
</template>


<style scoped></style>