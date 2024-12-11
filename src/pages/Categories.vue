<script setup>
import CategoryService  from '../services/category.servise.js'
import { useCategoryStore } from '../store/category.store.js'


import {  h, ref} from 'vue'

import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import { useI18n } from 'vue-i18n'
import moment from 'moment'
import CTable from '../components/common/CTable.vue'
import { computed } from 'vue'
const { t } = useI18n()

const globalSearchFromTable = ref('')
const isLoading = ref(false)
const renderKey = ref(0)
const categories = computed(() => {
  renderKey.value += 1
  return useCategoryStore.categories
})


const getCategories = async () => {
  isLoading.value = true
  try {
    const res = await CategoryService.getCategories()
    useCategoryStore().clearStore()
    useCategoryStore().setCategories(res)
    useCategoryStore().renderkey += 1
  } finally {
    isLoading.value = false
  }
}

getCategories()

const columns = [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'cursor-default'}, t('n')),
    enableSorting: false,
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
  },

  {
    accessorKey: 'name',
    header: 'Nomi',
  },

  {
    accessorKey: 'createdAt',
    accessorFn: row => moment(row.createdAt).format('DD/MM/YYYY H:mm'),
    header: t('createdAt'),
  },
 
]

</script>
<template>
  <div class="p-4 md:p-8">
    <div class="text-slate-900 dark:text-white text-2xl md:text-3xl font-semibold mb-6">
      {{ $t('barcodes') }}
    </div>
    <div class="flex flex-col md:flex-row items-center justify-between">
      <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400 dark:text-white" />
        </div>
        <input type="search" v-model="globalSearchFromTable"
          class="bg-slate-100 border-none w-full dark:bg-slate-700 dark:text-white text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
          placeholder="Search everything..." />
      </div>
      
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 dark:text-zinc-300 animate-spin" />
    </div>
    <CTable v-else :data="categories" :key="renderKey" :columns="columns" :filter="globalSearchFromTable" />

    <div class="flex items-center justify-between my-6">
      <div class="text-base text-slate-900 dark:text-white font-medium">
        {{ $t('total') }}:
      
      </div>
      <div class="flex items-center space-x-2">
      </div>
    </div>
  </div>
</template>
