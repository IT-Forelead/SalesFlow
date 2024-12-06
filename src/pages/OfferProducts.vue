<script setup>
import { computed, h, onMounted, ref, watch } from 'vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import ProductsTable from '../components/common/ProductsTable.vue'
import OfferProductService from '../services/offer.service'
import EditIcon from '../assets/icons/EditIcon.vue'
import { useModalStore } from '../store/modal.store'
import { useOfferProductStore } from '../store/offer.store'
import useMoneyFormatter from '../mixins/currencyFormatter'
import CaretRightIcon from '../assets/icons/CaretRightIcon.vue'
import CaretLeftIcon from '../assets/icons/CaretLeftIcon.vue'
import CaretDoubleLeftIcon from '../assets/icons/CaretDoubleLeftIcon.vue'
import CaretDoubleRightIcon from '../assets/icons/CaretDoubleRightIcon.vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../store/auth.store.js'
import decodeJwt, { parseJwt } from '../mixins/utils.js'
import { useRoute, useRouter } from 'vue-router'
import moment from 'moment'

const { t } = useI18n()
const searchFilter = ref('')
const isLoading = ref(false)
const renderKey = ref(0)
const payload = ref({})
const globalSearchFromTable = ref('')
const products = computed(() => {
  renderKey.value += 1
  return useOfferProductStore().offerProducts
})
const route = useRoute();
const router = useRouter();

const total = computed(() => {
  return useOfferProductStore().total
})
const currentPage = computed(() => {
  return useOfferProductStore().currentPage
})

const saleTypeTranslate = (type) => {
  switch (type) {
    case 'amount':
      return 'dona'
    case 'litre':
      return 'litr'
    case 'kg':
      return 'kilogramm'
    case 'g':
      return 'gramm'
  }
}

const paymentTypeTranslate = (type) => {
  switch (type) {
    case 'cash':
      return t('cash')
    case 'terminal':
      return t('terminal')
    case 'bank_transfer':
      return t('bankTransfer')
  }
}

const paymentStatusTranslate = (type) => {
  switch (type) {
    case 'paid':
      return t('paid')
    case 'unpaid':
      return t('unpaid')
  }
}

const offerProductStatusTranslate = (type) => {
  switch (type) {
    case 'requested':
      return t('requested')
    case 'ordered':
      return t('ordered')
    case 'delivered':
      return t('delivered')
    case 'cancelled':
      return t('cancelled')
  }
}

const columns = [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'cursor-default' }, t('n')),
    enableSorting: false,
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
  },
  {
    accessorKey: 'actions',
    header: t('actions'),
    // cell: ({ row }) ,
    enableSorting: false,
  },
]

const page = ref(1)
const pageSize = 50



const debounce = (fn, delay) => {
  let timerId
  return (...args) => {
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

const searchProducts = debounce(() => {
  const query = searchFilter.value.trim() ? { search: searchFilter.value } : {};
  router.push({ query });
  if (searchFilter.value.trim() === '') {
    getOfferProducts({ limit: pageSize, page: currentPage.value });
  } else {
    getOfferProducts({ name: searchFilter.value });
  }
}, 300);

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
    currentPage.value = page.value
  }
}

const prevPage = () => {
  goToPage(page.value - 1)
}
const nextPage = () => {
  goToPage(page.value + 1)
}

// getOfferProducts()

watch(page, () => {
  getOfferProducts()
})

watch(searchFilter, searchProducts)
const navigationGuard = (access) => {
  return payload.value?.privileges?.includes(access)
}

onMounted(() => {
  useAuthStore().setUser(decodeJwt(JSON.parse(localStorage.getItem('session'))?.accessToken))
  payload.value = parseJwt()
  if (route.query.search) {
    searchFilter.value = route.query.search;
  }
})

watch(route, (newRoute) => {
  if (newRoute.query.search) {
    searchFilter.value = newRoute.query.search;
    searchProducts();
  } else {
    searchFilter.value = '';
    getOfferProducts();
  }
});
</script>

<template>
  <div class="p-4 md:p-8">
    <div class="text-slate-900 dark:text-white text-2xl md:text-3xl font-semibold mb-6">
      {{ $t('offerProducts') }}
    </div>
    <div class="flex flex-col md:flex-row items-center justify-between">
      <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400 dark:text-white" />
        </div>
        <input type="search" v-model="searchFilter"
          class="bg-slate-100 border-none w-full dark:bg-slate-700 dark:text-white text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
          placeholder="Search everything...">
      </div>
      <div class="w-full md:w-auto order-1 md:order-2 flex space-x-2">
        <button v-if="navigationGuard('create_product')" @click="useModalStore().openCreateOfferProductModal()"
          class="w-full md:w-auto py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          {{ $t('addProduct') }}
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 dark:text-zinc-300 animate-spin" />
    </div>
    <ProductsTable v-else :data="products" :key="renderKey" :columns="columns" :filter="globalSearchFromTable" />

    <div class="flex items-center justify-between my-6">
      <div class="text-base text-slate-900 dark:text-white font-medium">
        {{ $t('total') }}:
        {{ total }}
      </div>
      <div class="flex items-center space-x-2">
        <button :disabled="page === 1" @click="goToPage(1)"
          class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900 dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
          <CaretDoubleLeftIcon class="w-5 h-5" />
        </button>
        <button @click="prevPage" :disabled="page === 1"
          class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900 dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
          <CaretLeftIcon class="w-5 h-5" />
        </button>
        <div class="flex items-center space-x-2">
          <button v-for="pageNumber in displayedPageNumbers" :key="pageNumber" @click="goToPage(pageNumber)"
            :class="{ 'bg-blue-600 text-white': pageNumber === page, 'hover:bg-blue-200': pageNumber !== page }"
            class="px-3 py-2 select-none rounded-lg text-slate-900 dark:text-white text-center text-base font-medium transition-all">
            {{ pageNumber }}
          </button>
        </div>
        <button @click="nextPage" :disabled="page === totalPages"
          class="flex items-center gap-2 px-3 py-2 text-base font-medium text-center text-slate-900 dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
          <CaretRightIcon class="w-5 h-5" />
        </button>
        <button :disabled="page === totalPages" @click="goToPage(totalPages)"
          class="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-900 dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
          <CaretDoubleRightIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>
