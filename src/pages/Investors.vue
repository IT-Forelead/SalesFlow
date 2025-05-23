<script setup>
import EyeIcon from '../assets/icons/EyeIcon.vue'
import { ref } from 'vue'
import moment from 'moment'
import { computed, h } from 'vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import CTable from '../components/common/CTable.vue'
import { useModalStore } from '../store/modal.store.js'
import { useI18n } from 'vue-i18n'
import { useInvestorStore } from '../store/investor.store.js'
import { useInvestStore } from '../store/invest.store.js'
import InvestorService from '../services/investor.service.js'
import InvestService from '../services/invest.service.js'

const { t } = useI18n()
const investorStore = useInvestorStore()
const globalSearchFromTable = ref('')
const isLoading = ref(false)
const investors = computed(() => investorStore.investors)
const renderkey = computed(() => investorStore.renderkey)

const columns = [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'cursor-default'}, t('n')),
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
    enableSorting: false,
  },
  {
    accessorKey: 'fullName',
    header: t('fullName'),
  },
  {
    accessorKey: 'phone',
    header: t('phoneNumber'),
  },
  {
    accessorKey: 'createdAt',
    accessorFn: row => moment(row.createdAt).format('DD/MM/YYYY H:mm'),
    header: t('createdAt'),
  },
  {
    accessorKey: 'actions',
    header: t('actions'),
    cell: ({ row }) => h('div', { class: 'flex items-center space-x-2' }, [
      h('button', { onClick: () => { openInvestorInfo(row.original) } }, [
        h(EyeIcon, { class: 'w-6 h-6 dark:text-blue-400 text-blue-600 hover:scale-105' })
      ]),
    ]),
    enableSorting: false,
  },
]

const openInvestorInfo = async (data) => {
  useInvestorStore().setSelectedInvestor(data)
  try {
    const res = await InvestService.getInvestsByFilters({ investorId: data.id})
    useInvestStore().clearStore()
    useInvestStore().setInvests(res.data)
    useInvestorStore().renderkey += 1
  } finally {
    useModalStore().openInvestorInfoModal()
  }
}

const getBalances = async () => {
  isLoading.value = true
  try {
    const res = await InvestorService.getInvestorsByFilter({})
    useInvestorStore().clearStore()
    useInvestorStore().setInvestors(res.data)
    useInvestorStore().renderkey += 1
  } finally {
    isLoading.value = false
  }
}
getBalances()

</script>

<template>
  <div class="p-4 md:p-8">
    <div class="text-slate-900 dark:text-white text-2xl md:text-3xl font-semibold mb-6">
      {{ $t('investors') }}
    </div>
    <div class="flex flex-col md:flex-row items-center justify-between">
      <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400 dark:text-white" />
        </div>
        <input type="search" v-model="globalSearchFromTable"
          class="bg-slate-100 border-none w-full dark:bg-slate-700 dark:text-white text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
          :placeholder="$t('search')">
      </div>
      <div class="w-full md:w-auto order-1 md:order-2">
        <button @click="useModalStore().openCreateInvestorModal()"
          class="w-full md:w-auto py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          {{ $t('createInvestor') }}
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 dark:text-zinc-300 animate-spin" />
    </div>
    <CTable :key="renderkey" v-else :data="investors" :columns="columns" :filter="globalSearchFromTable" />
  </div>
</template>
