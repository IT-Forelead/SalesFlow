<script setup>
import { computed, h, onMounted, ref, watch } from 'vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import HistoryTable from '../components/common/HistoryTable.vue'
import { useProductHistoryStore } from '../store/productHistory.store.js'
import useMoneyFormatter from '../mixins/currencyFormatter.js'
import CaretDoubleRightIcon from '../assets/icons/CaretDoubleRightIcon.vue'
import CaretDoubleLeftIcon from '../assets/icons/CaretDoubleLeftIcon.vue'
import CaretLeftIcon from '../assets/icons/CaretLeftIcon.vue'
import CopyIcon from '../assets/icons/CopyIcon.vue'
import CaretRightIcon from '../assets/icons/CaretRightIcon.vue'
import { useI18n } from 'vue-i18n'
import EditIcon from '../assets/icons/EditIcon.vue'
import { useModalStore } from '../store/modal.store.js'
import { useAuthStore } from '../store/auth.store.js'
import decodeJwt, { cleanObjectEmptyFields, parseJwt } from '../mixins/utils.js'
import PrinterIcon from '../assets/icons/PrinterIcon.vue'
import axios from 'axios'
import { toast } from 'vue-sonner'
import ProductService from '../services/product.service.js'
import { useRoute, useRouter } from 'vue-router'

const { t } = useI18n()
const API_URL = import.meta.env.VITE_CHEQUE_API_URL
const searchFilter = ref('')
const isLoading = ref(false)
const productHistoryStore = useProductHistoryStore()
const renderKey = ref(0)
const page = ref(1)
const pageSize = 50
const payload = ref({})
const route = useRoute();
const router = useRouter();

const currentPage = computed(() => {
  return productHistoryStore.currentPage
})
const productsHistories = computed(() => {
  renderKey.value += 1
  return productHistoryStore.productHistories
})

const total = computed(() => {
  return productHistoryStore.totalHistories
})

const getHistoryType = (historyType) => {
  switch (historyType) {
    case 'purchased':
      return t('income')
    case 'returned':
      return t('returned')
    default:
      return t('unknown')
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
    accessorKey: 'serialId',
    header: t('serialId'),
  },
  {
    accessorKey: 'name',
    header: t('product'),
    cell: ({ row }) => {
      const productName = `${row.original.name} - (${row.original.packaging})`
      const lendBadge = row.original.toLend ? h('span', { class: 'bg-red-600 mx-2 text-white rounded-lg px-2 py-1 text-sm' }, t('toLend')) : null
      return h('div', {}, [productName, lendBadge])
    },
  },
  {
    accessorKey: 'quantity',
    header: t('quantity'),
  },
  {
    accessorKey: 'historyType',
    header: t('type'),
    cell: ({ row }) => getHistoryType(row.original.historyType),
  },
  {
    accessorKey: 'purchasePrice',
    header: t('purchasePrice'),
    cell: ({ row }) => useMoneyFormatter(row.original.purchasePrice),
  },
  {
    accessorKey: 'salePrice',
    header: t('salePrice'),
    cell: ({ row }) => useMoneyFormatter(row.original.price),
  },
  {
    accessorKey: 'percent',
    header: t('percent'),
    cell: ({ row }) => calcPercentOfSale(row.original.purchasePrice, row.original.price) + "%",
  },
  {
    accessorKey: 'productionDate',
    header: t('productionDate'),
  },
  {
    accessorKey: 'expirationDate',
    header: t('expirationDate'),
  },
  {
    accessorKey: 'actions',
    header: t('actions'),
    cell: ({ row }) => h('div', { class: 'flex items-center space-x-2' }, [
      h('button', {
        onClick: () => {
          createDuplicateProductModal(row.original)
        },
      }, [
        h(CopyIcon, { class: 'w-6 h-6 text-blue-600 hover:scale-105' }),
      ]),
      h('button', {
        onClick: () => {
          openEditProductModalHistory(row.original)
        },
      }, [
        h(EditIcon, { class: 'w-6 h-6 text-blue-600 hover:scale-105' }),
      ]),
      h('button', {
        onClick: () => {
          printLabel(row.original)
        },
      }, [
        h(PrinterIcon, { class: 'w-6 h-6 text-blue-600 hover:scale-105' }),
      ]),
      // h('button', {
      //   onClick: () => {
      //     openDeleteProductModal(row.original)
      //   },
      // }, [
      //   // h(TrashIcon, { class: 'w-6 h-6 text-red-600 hover:scale-105' }),
      // ]),
    ]),
    enableSorting: false,
  },
]

const calcPercentOfSale = (purchasePrice, salePrice) => {
  const num = (((salePrice - purchasePrice) * 100) / salePrice).toFixed(1)
  if (num % 1 === 0) {
    return Math.floor(num);
  } else {
    return num;
  }
}

const printLabel = (product) => {
  const quantity = product.saleType.includes('kg') ? Number.parseFloat(product.quantity) * 1000 : product.quantity
  const barcode = !product.barcode ? `9${String(product.serialId).padStart(6, '0')}${String(quantity).padStart(5, '0')}1` : product.barcode
  axios
    .post(
      API_URL + '/print-label',
      cleanObjectEmptyFields({
        name: product.name,
        barcode: barcode,
        quantity: 1,
        count: 1,
        saleType: product.saleType,
        packaging: product.packaging,
        serialId: product.serialId,
        price: product.price,
        productionDate: product.productionDate,
        expirationDate: product.expirationDate,
        totalPrice: product.price,
      })
    )
    .then(async () => {
      toast.success(t('labelCreatedSuccessfully'))
    })
    .catch(() => {
      toast.error(t('errorWhileCreatingLabel'))
    })
}

const openEditProductModalHistory = (data) => {
  useModalStore().openEditProductHistoryModal()
  useProductHistoryStore().setSelectedProductHistory(data)
}

const getProductHistories = (filters = {}) => {
  isLoading.value = true
  ProductService.getProductsDetails({ limit: pageSize, page: page.value, ...filters })
    .then((res) => {
      useProductHistoryStore().clearStore()
      useProductHistoryStore().totalHistories = res.total
      useProductHistoryStore().setProductHistories(res.data)
      useProductHistoryStore().currentPage = page.value
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
//   const query = searchFilter.value.trim() ? { search: searchFilter.value } : {};
//   router.push({ query });
//   if (searchFilter.value.trim() === '') {
//     getProductHistories({ limit: pageSize, page: currentPage.value });
//   } else {
//     const filters = searchFilter.value.match(/^\d+$/) ? { barcode: searchFilter.value } : { name: searchFilter.value };
//     getProductHistories(filters);
//   }
// }, 300);

const searchProducts = debounce(() => {
  const query = searchFilter.value.trim() ? { search: searchFilter.value } : {};
  router.push({ query });
  const trimmedValue = searchFilter.value.trim();
  let filters = {};

  if (trimmedValue === '') {
    // No search input, get all products
    getProductHistories({ limit: pageSize, page: currentPage.value });
    return; // Exit early
  }
  // Check if the input is a number
  if (!isNaN(trimmedValue)) {
    // If the input is a number, check if it starts with "9"
    if (trimmedValue.startsWith("9")) {
      filters = { name: String(trimmedValue) };
    } else {
      // Search by barcode
      filters = { barcode: trimmedValue };
    }
  } else {
    // Search by name
    filters = { name: trimmedValue };
  }
  getProductHistories(filters);
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

getProductHistories()

watch(page, () => {
  getProductHistories()
})
watch(searchFilter, searchProducts)

const navigationGuard = (access) => {
  return payload.value?.privileges?.includes(access)
}

const createDuplicateProductModal = (data) => {
  useModalStore().openCreateProductModal()
  useProductHistoryStore().setSelectedProductHistory(data)
}

onMounted(() => {
  useAuthStore().setUser(decodeJwt(JSON.parse(localStorage.getItem('session'))?.accessToken))
  payload.value = parseJwt()
  if (route.query.search) {
    searchFilter.value = route.query.search;
  }
  // getProductHistories();
})

watch(route, (newRoute) => {
  if (newRoute.query.search) {
    searchFilter.value = newRoute.query.search;
    searchProducts();
  } else {
    searchFilter.value = '';
    getProductHistories();
  }
});
</script>
<template>
  <div class="p-4 md:p-8">
    <div class="text-slate-900 text-2xl md:text-3xl font-semibold mb-6">
      {{ $t('productsHistory') }}
    </div>
    <div class="flex md:flex-row flex-col items-center justify-between">
      <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400" />
        </div>
        <input type="search" v-model="searchFilter"
               class="bg-slate-100 border-none w-full text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
               placeholder="Search everything...">
      </div>
      <div class="w-full md:w-auto order-1 md:order-2 flex space-x-2">
        <button v-if="navigationGuard('create_product')" @click="useModalStore().openCreateLabelModal()"
                class="w-full md:w-auto py-2 px-4 rounded-full text-white text-lg font-medium bg-green-500 cursor-pointer hover:bg-green-600">
          {{ $t('createLabel') }}
        </button>
        <button v-if="navigationGuard('create_product')" @click="useModalStore().openCreateProductModal()"
                class="w-full md:w-auto py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          {{ $t('addProduct') }}
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 animate-spin" />
    </div>
    <HistoryTable v-else :data="productsHistories" :key="renderKey" :columns="columns" />
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
