<script setup>
import PhPencilLine from '../assets/icons/EditIcon.vue'
import { ref } from 'vue'
import moment from 'moment'
import { computed, h } from 'vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import CTable from '../components/common/CTable.vue'
import { useModalStore } from '../store/modal.store.js'
import { useI18n } from 'vue-i18n'
import { useInvestStore } from '../store/invest.store.js'
import InvestService from '../services/invest.service.js'
import EyeIcon from '../assets/icons/EyeIcon.vue'
import TrashIcon from '@/assets/icons/TrashIcon.vue'

const { t } = useI18n()
const investStore = useInvestStore()
const globalSearchFromTable = ref('')
const isLoading = ref(false)
const invests = computed(() => investStore.invests)
const capitalize = (word) => {
  const [firstLetter, ...rest] = word.split('');
  const upperCaseLetter = firstLetter.toUpperCase();
  if (firstLetter === upperCaseLetter) {
    return;
  }
  return firstLetter.toUpperCase() + rest.join('');
}
const renderkey = computed(() => investStore.renderkey)

const columns = [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'cursor-default' }, t('n')),
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
    enableSorting: false,
  },

  {
    accessorKey: 'amount',
    header: t('amount'),
  },
  {
    accessorKey: 'rate',
    header: t('ratePercent'),
  },
  {
    accessorKey: 'status',
    accessorFn: row => capitalize(row.status),
    header: t('status'),
  },
  {
    accessorKey: 'activatedAt',
    header: t('activatedAt'),
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
      h('button', { onClick: () => { openEditInvestStatus(row.original) } }, [
        h(PhPencilLine, { class: 'w-6 h-6 dark:text-blue-400 text-blue-600 hover:scale-105' })
      ]),
      h('button', { onClick: () => { openInvestDaily(row.original) } }, [
        h(EyeIcon, { class: 'w-6 h-6 dark:text-blue-400 text-blue-600 hover:scale-105' })
      ]),

      h('button', { onClick: () => { openDeleteInvest(row.original) } }, [
        h(TrashIcon, { class: 'w-6 h-6 dark:text-red-400 text-red-600 hover:scale-105' })
      ]),
    ]),
    enableSorting: false,
  },
]

const openEditInvestStatus = (data) => {
  useInvestStore().setSelectedInvest(data)
  useModalStore().openEditInvestStatusModal()
}

const getInvestsByFilters = async (filter) => {
  isLoading.value = true
  try {
    const res = await InvestService.getInvestsByFilters(filter)
    useInvestStore().clearStore()
    useInvestStore().setInvests(res.data)
    useInvestStore().renderkey += 1
  } finally {
    isLoading.value = false
  }
}
getInvestsByFilters({})

const openInvestDaily = (data) => {
  InvestService.getInvestDailyByFilters({
    investId: data.id,
    investorId: data.investorId, startDate: data.startDate,
    endDate: data.endDate,
    minAmount: data.minAmount,
    maxAmount: data.maxAmount,
    limit: data.limit,
    page: data.page
  }).then((res) => {
    useInvestStore().setInvestDaily(res.data)
    useModalStore().openInvestDailyModal()
  })
} 

const openDeleteInvest = (data) => {
  useModalStore().openDeleteInvestModal()
  useInvestStore().setSelectedInvest(data)
}
</script>

<template>
  <div class="p-4 md:p-8">
    <div class="text-slate-900 dark:text-white text-2xl md:text-3xl font-semibold mb-6">
      {{ $t('invests') }}
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
        <button @click="useModalStore().openCreateInvestModal()"
          class="w-full md:w-auto py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          {{ $t('createInvest') }}
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 dark:text-zinc-300 animate-spin" />
    </div>
    <CTable :key="renderkey" v-else :data="invests" :columns="columns" :filter="globalSearchFromTable" />
  </div>
</template>
