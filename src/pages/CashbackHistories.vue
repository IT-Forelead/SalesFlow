<script setup>
import { ref } from 'vue'
import moment from 'moment'
import { computed, h } from 'vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import EyeIcon from '../assets/icons/EyeIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import CTable from '../components/common/CTable.vue'
import UserService from '../services/user.service'
import { useUserStore } from '../store/user.store.js'
import { useModalStore } from '../store/modal.store.js'
import { useI18n } from 'vue-i18n'
import { useCashbackStore } from '../store/cashback.store.js'
import CashbackService from '../services/cashback.service.js'
import OrderService from '../services/order.service'
import useMoneyFormatter from '../mixins/currencyFormatter'
import { useOrderStore } from '../store/order.store'

const { t } = useI18n()

const globalSearchFromTable = ref('')
const isLoading = ref(false)
const renderkey = ref(0)
const cashbackStore = useCashbackStore()

const cashbacks = computed(() => {
  renderkey.value += 1
  return cashbackStore.cashbacks
})


const columns = [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'cursor-default'}, t('n')),
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
    enableSorting: false,
  },
  {
    accessorFn: row => `${row.customer.fullName}`,
    header: t('fullName'),
  },
  {
    accessorFn: row => `${row.customer.phone}`,
    header: t('phoneNumber'),
  },
  {
    accessorFn: row => `${useMoneyFormatter(row.amount)}`,
    header: t('cashbackAmount'),
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
      h('button', {
        onClick: () => {
          openOrderInfo(row.original)
        },
      }, [
        h(EyeIcon, { class: 'w-6 h-6 dark:text-blue-400 text-blue-600 hover:scale-105' }),
      ]),
    ]),
    enableSorting: false,
  },
]

const openOrderInfo = (data) => {
  OrderService.getOrderById(data.orderId).then((res) => {
    useOrderStore().setSelectedOrder(res)
    useOrderStore().fromCashback(true)
    useModalStore().openOrderInfoModal()

})

}

const getCashbacks = async () => {
  isLoading.value = true
  try {
    const res = await CashbackService.getCashbacks({})
    const sortedCashbacks = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    useCashbackStore().clearStore()
    useCashbackStore().setCashbacks(sortedCashbacks)
    useCashbackStore().renderkey += 1
  } finally {
    isLoading.value = false
  }
}
getCashbacks()

</script>

<template>
  <div class="p-4 md:p-8">
    <div class="dark:text-white text-slate-900 text-2xl md:text-3xl font-semibold mb-6">
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
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 dark:text-zinc-300 animate-spin" />
    </div>
    <CTable v-else :data="cashbacks" :key="renderkey" :columns="columns" :filter="globalSearchFromTable" />
  </div>
</template>
