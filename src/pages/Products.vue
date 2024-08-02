<script setup>
import { computed, h, onMounted, ref, watch, watchEffect } from 'vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import ProductsTable from '../components/common/ProductsTable.vue'
import ProductService from '../services/product.service'
import EditIcon from '../assets/icons/EditIcon.vue'
import TrashIcon from '../assets/icons/TrashIcon.vue'
import { useModalStore } from '../store/modal.store'
import { useProductStore } from '../store/product.store'
import useMoneyFormatter from '../mixins/currencyFormatter'
import CaretRightIcon from '../assets/icons/CaretRightIcon.vue'
import CaretLeftIcon from '../assets/icons/CaretLeftIcon.vue'
import CaretDoubleLeftIcon from '../assets/icons/CaretDoubleLeftIcon.vue'
import CaretDoubleRightIcon from '../assets/icons/CaretDoubleRightIcon.vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../store/auth.store.js'
import decodeJwt, { parseJwt } from '../mixins/utils.js'
import { useRoute, useRouter } from 'vue-router'
import { isBarcode } from '../mixins/barcodeFormatter'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

const searchFilter = ref('')
const isLoading = ref(false)
const renderKey = ref(0)
const payload = ref({})
const globalSearchFromTable = ref('')
const onSearchFocus = ref(null)

const products = computed(() => {
  renderKey.value += 1
  return productStore.products
})

const total = computed(() => {
  return productStore.total
})
const currentPage = computed(() => {
  return productStore.currentPage
})

const saleTypeTranslate = (type) => {
  switch (type) {
    case 'amount':
      return 'Donali'
    case 'litre':
      return 'Litrli'
    case 'kg':
      return 'Kilogrammli'
    case 'g':
      return 'Grammli'
  }
}

const saleTypeShortTranslate = (type) => {
  switch (type) {
    case 'amount':
      return t('piece')
    case 'litre':
      return t('litre')
    case 'kg':
      return t('kg')
    case 'g':
      return t('g')
  }
}

const columns = [
  {
    accessorKey: 'id',
    header: t('n'),
    enableSorting: false,
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
  },
  {
    accessorKey: 'asset',
    header: t('image'),
    cell: ({ row }) =>
      h('div', { class: 'flex items-center' }, [row.original.asset ?
        h('img', { src: `${row.original.asset.url}`, class: 'w-12 h-auto rounded', alt: '#' }) : h('span')]),
  },
  {
    accessorKey: 'name',
    header: t('name'),
  },
  {
    accessorKey: 'packaging',
    header: t('package'),
  },
  {
    accessorKey: 'barcode',
    header: t('barcode'),
  },
  {
    accessorKey: 'quantity',
    header: t('quantity'),
    accessorFn: row => `${Math.round((row.quantity * 100)) / 100} ${saleTypeShortTranslate(row.saleType)}`,
  },
  {
    accessorKey: 'saleType',
    header: t('typeOfSale'),
    accessorFn: row => `${saleTypeTranslate(row.saleType)}`,
  },
  {
    accessorKey: 'price',
    accessorFn: row => `${useMoneyFormatter(row.price)}`,
    header: t('price'),
  },
  {
    accessorKey: 'actions',
    header: t('actions'),
    cell: ({ row }) => h('div', { class: 'flex items-center space-x-2' }, [
      h('button', {
        onClick: () => {
          openEditProductModal(row.original)
        },
      }, [
        h(EditIcon, { class: 'w-6 h-6 text-blue-600 hover:scale-105' }),
      ]),
      h('div', [navigationGuard('delete_product') ?
        h('button', {
          onClick: () => {
            openDeleteProductModal(row.original, searchFilter.value)
          },
        }, [
          h(TrashIcon, { class: 'w-6 h-6 text-red-600 hover:scale-105' }),
        ]) : h('span')]),
    ]),
    enableSorting: false,
  },
]

const openEditProductModal = (data) => {
  useModalStore().openEditProductModal()
  useProductStore().setSelectedProduct(data)
}

const openDeleteProductModal = (data, searchFilter) => {
  useModalStore().openDeleteProductModal()
  useProductStore().setSelectedProduct(data)
  useProductStore().setSearchFilter(searchFilter)
}

const page = ref(1)
const pageSize = 50

const getProducts = (filters = {}) => {
  isLoading.value = true
  ProductService.getProducts({ limit: pageSize, page: page.value, ...filters })
    .then((res) => {
      useProductStore().clearStore()
      useProductStore().total = res.total
      useProductStore().currentPage = page.value
      useProductStore().setProducts(res.data)
    }).finally(() => {
      isLoading.value = false
    })
}

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

// const searchProducts = debounce(() => {
//   if (searchFilter.value.trim() === '') {
//     getProducts({ limit: pageSize, page: currentPage.value });
//   } else {
//     getProducts({ name: searchFilter.value });
//   }
// }, 300);

const searchProducts = debounce(() => {
  const query = searchFilter.value.trim() ? { search: searchFilter.value } : {};
  router.push({ query });
  if (searchFilter.value.trim() === '') {
    getProducts({ limit: pageSize, page: currentPage.value });
  } else if (isBarcode(searchFilter.value)) {
    getProducts({ barcode: searchFilter.value });
  } else {
    getProducts({ name: searchFilter.value });
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

getProducts()

watch(page, () => {
  getProducts()
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
    getProducts();
  }
})

watchEffect(() => {
  if (onSearchFocus.value) {
    onSearchFocus.value.focus()
  }
})
</script>

<template>
  <div class="p-4 md:p-8">
    <div class="text-slate-900 text-2xl md:text-3xl font-semibold mb-6">
      {{ $t('products') }}
    </div>
    <div class="flex flex-col md:flex-row items-center justify-between">
      <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400" />
        </div>
        <input type="search" v-model="searchFilter" ref="onSearchFocus"
          class="bg-slate-100 border-none w-full text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
          placeholder="Search everything...">
      </div>
      <div class="w-full md:w-auto order-1 md:order-2 flex space-x-2">
        <!--        <button v-if="navigationGuard('create_product')" @click="useModalStore().openCreateProductModal()"-->
        <!--          class="w-full md:w-auto py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">-->
        <!--          {{ $t('addProduct') }}-->
        <!--        </button>-->
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 animate-spin" />
    </div>
    <ProductsTable v-else :data="products" :key="renderKey" :columns="columns" :filter="globalSearchFromTable" />

    <div class="flex items-center justify-between my-6">
      <div class="text-base text-slate-900 font-medium">
        {{ $t('total') }}:
        {{ total }}
      </div>
      <div class="flex items-center space-x-2">
        <button :disabled="page === 1" @click="goToPage(1)"
          class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
          <CaretDoubleLeftIcon class="w-5 h-5" />
        </button>
        <button @click="prevPage" :disabled="page === 1"
          class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
          <CaretLeftIcon class="w-5 h-5" />
        </button>
        <div class="flex items-center space-x-2">
          <button v-for="pageNumber in displayedPageNumbers" :key="pageNumber" @click="goToPage(pageNumber)"
            :class="{ 'bg-blue-600 text-white': pageNumber === page, 'hover:bg-blue-200': pageNumber !== page }"
            class="px-3 py-2 select-none rounded-lg text-slate-900 text-center text-base font-medium transition-all">
            {{ pageNumber }}
          </button>
        </div>
        <button @click="nextPage" :disabled="page === totalPages"
          class="flex items-center gap-2 px-3 py-2 text-base font-medium text-center text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
          <CaretRightIcon class="w-5 h-5" />
        </button>
        <button :disabled="page === totalPages" @click="goToPage(totalPages)"
          class="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
          <CaretDoubleRightIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>
