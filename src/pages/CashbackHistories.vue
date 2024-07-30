<script setup>
import EyeIcon from '../assets/icons/EyeIcon.vue'
import PhTrash from '../assets/icons/TrashIcon.vue'
import { ref } from 'vue'
import moment from 'moment'
import { computed, h } from 'vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import CTable from '../components/common/CTable.vue'
import UserService from '../services/user.service'
import { useUserStore } from '../store/user.store.js'
import { useModalStore } from '../store/modal.store.js'
import { useI18n } from 'vue-i18n'
import { useCashbackStore } from '../store/cashback.store.js'
import CashbackService from '../services/cashback.service.js'

const { t } = useI18n()

const cashbackStore = useCashbackStore()
const globalSearchFromTable = ref('')
const isLoading = ref(false)
const renderkey = ref(0)

const cashbacks = computed(() => {
  renderkey.value += 1
  return cashbackStore.cashbacks
})


const columns = [
  {
    accessorKey: 'id',
    header: t('n'),
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
  },
  {
    accessorFn: row => `${row.fullName}`,
    header: t('fullName'),
  },
  {
    accessorKey: 'phone',
    header: t('phoneNumber'),
  },
  {
    accessorKey: 'company',
    header: t('shopName'),
  },
  {
    accessorKey: 'type',
    header: t('type'),
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
      h('button', { onClick: () => { openCashbackInfo(row.original) } }, [
        h(EyeIcon, { class: 'w-6 h-6 text-blue-600 hover:scale-105' })
      ]),
    ]),
    enableSorting: false,
  },
]

const openCashbackInfo = (data) => {
  useModalStore().openCashbackInfoModal()
  useCashbackStore().setSelectedOrder(data)
}

// const getCashbacks = () => {
//   isLoading.value = true
//   CashbackService.getCashbacks()
//     .then((res) => {
//       useCashbackStore().clearStore()
//       useCashbackStore().setCashbacks(res)
//     }).finally(() => {
//       isLoading.value = false
//     })
// }

// getCashbacks()

</script>

<template>
  <div class="p-4 md:p-8">
    <div class="text-slate-900 text-2xl md:text-3xl font-semibold mb-6">
      {{ $t('cashbackHistories') }}
    </div>
    <div class="flex flex-col md:flex-row items-center justify-between">
      <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400" />
        </div>
        <input type="search" v-model="globalSearchFromTable"
          class="bg-slate-100 border-none w-full text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
          :placeholder="$t('search')">
      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 animate-spin" />
    </div>
    <CTable :key="renderkey" v-else :data="cashbacks" :columns="columns" :filter="globalSearchFromTable" />
  </div>
</template>
