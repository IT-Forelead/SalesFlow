<script setup>
import { computed, h, onMounted, ref, watch } from 'vue'

import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'


import SessionService from '../services/session.service.js'
import { useAuthStore } from '../store/auth.store.js'
import decodeJwt, { parseJwt } from '../mixins/utils.js'
import { useI18n } from 'vue-i18n'
import { useSessionStore } from '../store/session.store.js'
import CTable from '../components/common/CTable.vue'
import CaretLeftIcon from '../assets/icons/CaretLeftIcon.vue'
import CaretRightIcon from '../assets/icons/CaretRightIcon.vue'



 
const { t } = useI18n()

const globalSearchFromTable = ref('')
const renderKey = ref(0)
// const payload = ref({})
const Session = useSessionStore()
const AllSession = computed(() => {
  renderKey.value += 1
  return Session.AllSession || []
}) 

const isLoading = ref(false)
const page = ref(1)
const pageSize = 50
const total = ref(0)

const columns = [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'cursor-default'}, t('n')),
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: t('name'),
  },
  {
    accessorKey: 'ipAddress',
    header: t('ipAddress'),
  },
  {
    accessorKey: 'loginTime',
    header: t('loginTime'),
  },
  {
    accessorKey: 'lastActionTime',
    header: t('lastActionTime'),
  },
  {
    accessorKey: 'lastAction',
    header: t('lastAction'),
  },
 
 
//   {
//     accessorKey: 'createdAt',
//     accessorFn: row => moment(row.createdAt).format('DD/MM/YYYY H:mm'),
//     header: t('createdAt'),
//   },
  
]

const getAllSessions = (filters = {}) => {
  isLoading.value = true
SessionService.getAllSessions({ limit: pageSize, page: page.value, date: date.value, ...filters })
    .then((response) => {
      total.value = response.total
      useSessionStore().clearStore()
      useSessionStore().setAllSession(response.data)
    }).finally(() => {
    isLoading.value = false
  })
}



onMounted(() => {
  useAuthStore().setUser(decodeJwt(JSON.parse(localStorage.getItem('session'))?.accessToken))
  getAllSessions()
})

</script>

<template>
  <div class="p-4 md:p-8">
    <div class="flex md:flex-row flex-col items-center justify-between space-y-4 md:space-y-0 mb-6">
      <div class="dark:text-white text-slate-900 text-2xl md:text-3xl font-semibold">
      {{ $t('clients') }}
    </div>

    </div>
    <div class="flex flex-col md:flex-row items-center justify-between">
      <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400 dark:text-white" />
        </div>
        <input type="search" v-model="globalSearchFromTable"
               class="bg-slate-100 dark:bg-slate-700 dark:text-white border-none w-full text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
               placeholder="Search everything...">
      </div>
    </div>
    
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 dark:text-zinc-300 animate-spin" />
    </div>
   
    <CTable v-else :data="AllSession" :key="renderKey" :columns="columns" :filter="globalSearchFromTable" />
  </div>
</template>
