<script setup>
import { computed, h, onMounted, ref, watch } from 'vue'
import moment from 'moment'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import TrashIcon from '../assets/icons/TrashIcon.vue'
import { useModalStore } from '../store/modal.store'
import { useMarketStore } from '../store/market.store'
import { useAuthStore } from '../store/auth.store.js'
import decodeJwt, { parseJwt } from '../mixins/utils.js'
import { useI18n } from 'vue-i18n'
import EyeIcon from '../assets/icons/EyeIcon.vue'
import DollarIcon from '../assets/icons/CurrencyCircleDollar.vue'
import CTable from '../components/common/CTable.vue'
import CaretLeftIcon from '../assets/icons/CaretLeftIcon.vue'
import CaretRightIcon from '../assets/icons/CaretRightIcon.vue'
import CaretDoubleRightIcon from '../assets/icons/CaretDoubleRightIcon.vue'
import CaretDoubleLeftIcon from '../assets/icons/CaretDoubleLeftIcon.vue'
import useMoneyFormatter from '../mixins/currencyFormatter.js'
import FileLinearIcon from '../assets/icons/FileLinearIcon.vue'
import CustomerService from '../services/customer.service'
import CashbackService from '../services/cashback.service'
import { useCustomerStore } from '../store/customer.store';
import { cleanObjectEmptyFields } from '../mixins/utils'
 
const { t } = useI18n()

const globalSearchFromTable = ref('')
const renderKey = ref(0)
const payload = ref({})
const CustomersStore = useCustomerStore()
const customers = computed(() => {
  renderKey.value += 1
  return CustomersStore.customers
})

const isLoading = ref(false)
const page = ref(1)
const pageSize = 50
const total = ref(0)

const columns = [
  {
    accessorKey: 'id',
    header: t('n'),
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
    accessorKey: 'cashback',
    accessorFn: row => `${useMoneyFormatter(row.cashback)}`,
    header: t('cashbackAmount'),
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
      h('button', { onClick: () => { openCashbackHistory(row.original) } }, [
        h(EyeIcon, { class: 'w-6 h-6 text-blue-600 hover:scale-105' })
      ]),
    ]),
    enableSorting: false,
  },
]

const openCashbackHistory = (data) => {
  console.log(data);
//  useCustomerStore().setSelectedCustomer(data)
  getCustomerHistories(data)
}

const getCustomerHistories = async (data) => {
  console.log(data)
  console.log(data)
  isLoading.value = true
  try {
    const res = await CashbackService.getCashbacks(
    cleanObjectEmptyFields({
      customerId: data.id

    }))
    useCustomerStore().setCustomerHistories(res.data)
    useCustomerStore().renderkey += 1
  } finally {
    isLoading.value = false
    useModalStore().openCashbackHistoryModal()
  }
}

const getCustomers = (filters = {}) => {
  isLoading.value = true
  CustomerService.getCustomers({ limit: pageSize, page: page.value, ...filters })
    .then((response) => {
      useCustomerStore().clearStore()
      total.value = response.total
      useCustomerStore().setCustomers(response.data)
    }).finally(() => {
    isLoading.value = false
  })
}

const totalPages = computed(() => Math.ceil(total.value / pageSize))
const displayedPageNumbers = computed(() => {
  const numPages = Math.min(4, totalPages.value)
  const startPage = Math.max(1, page.value - Math.floor(numPages / 2))
  const endPage = Math.min(totalPages.value, startPage + numPages - 1)
  const pages = []
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  return pages
})

const goToPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPages.value) {
    page.value = pageNumber
  }
}

const prevPage = () => {
  goToPage(page.value - 1)
}
const nextPage = () => {
  goToPage(page.value + 1)
}

getCustomers()

watch(page, () => {
  getCustomers()
})

onMounted(() => {
  useAuthStore().setUser(decodeJwt(JSON.parse(localStorage.getItem('session'))?.accessToken))
  payload.value = parseJwt()
})

</script>

<template>
  <div class="p-4 md:p-8">
    <div class="flex md:flex-row flex-col items-center justify-between space-y-4 md:space-y-0 mb-6">
      <div class="text-slate-900 text-2xl md:text-3xl font-semibold">
      {{ $t('clients') }}
    </div>
   
    </div>
    <div class="flex flex-col md:flex-row items-center justify-between">
      <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400" />
        </div>
        <input type="search" v-model="globalSearchFromTable"
               class="bg-slate-100 border-none w-full text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
               placeholder="Search everything...">
      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 animate-spin" />
    </div>
    <CTable v-else :data="customers" :key="renderKey" :columns="columns" :filter="globalSearchFromTable" />
    
  </div>
</template>
