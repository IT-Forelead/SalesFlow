<script setup>
import { computed, h, onMounted, reactive, ref, watch, watchEffect } from 'vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import HistoryTable from '../components/common/HistoryTable.vue'
import { useProductHistoryStore } from '../store/productHistory.store.js'
import useMoneyFormatter from '../mixins/currencyFormatter.js'
import CaretDoubleRightIcon from '../assets/icons/CaretDoubleRightIcon.vue'
import CaretDoubleLeftIcon from '../assets/icons/CaretDoubleLeftIcon.vue'
import FunnelIcon from '../assets/icons/FunnelIcon.vue'
import CaretLeftIcon from '../assets/icons/CaretLeftIcon.vue'
import CopyIcon from '../assets/icons/CopyIcon.vue'
import CaretRightIcon from '../assets/icons/CaretRightIcon.vue'
import { useI18n } from 'vue-i18n'
import EditIcon from '../assets/icons/EditIcon.vue'
import { useModalStore } from '../store/modal.store'
import { useDropdownStore } from '../store/dropdown.store'
import { useAuthStore } from '../store/auth.store.js'
import decodeJwt, { calcPercentOfSale, cleanObjectEmptyFields, parseJwt } from '../mixins/utils.js'
import PrinterIcon from '../assets/icons/PrinterIcon.vue'
import axios from 'axios'
import { toast } from 'vue-sonner'
import ProductService from '../services/product.service.js'
import { useRoute, useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import BroomIcon from '../assets/icons/BroomIcon.vue'
import InputSwitch from 'primevue/inputswitch';
import { useProductStore } from '../store/product.store.js'
import { isBarcode } from '../mixins/barcodeFormatter'
import UtilizeIcon from '../assets/icons/UtilizeIcon.vue'

import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";

const { t } = useI18n()
const API_URL = import.meta.env.VITE_CHEQUE_API_URL
const searchFilter = ref('')
const isLoading = ref(false)
const productHistoryStore = useProductHistoryStore()
const renderKey = ref(0)
const page = ref(1)
const pageSize = 50
const payload = ref({})
const route = useRoute()
const router = useRouter()
const onSearchFocus = ref(null)

const sortByDropdown = ref(null)
const filterByDropdown = ref(null)
const checked = ref(false)
const currentPage2 = computed(() => productHistoryStore.currentPage)
onClickOutside(sortByDropdown, () => {
  if (useDropdownStore().isOpenSortBy) {
    useDropdownStore().toggleSortBy()
  }
})

onClickOutside(filterByDropdown, () => {
  if (useDropdownStore().isOpenFilterBy) {
    useDropdownStore().toggleFilterBy()
  }
})

const filterData = reactive({
  remainingProducts: false,
  sortBy: '',
  sortOrder: '',
  startExpirationDate: '',
  endExpirationDate: '',
})

const clearFilterData = () => {
  filterData.remainingProducts = false
  filterData.sortBy = ''
  filterData.sortOrder = ''
  filterData.startExpirationDate = ''
  filterData.endExpirationDate = ''
}

const currentPage = computed(() => productHistoryStore.currentPage )
const total = computed(() => productHistoryStore.totalHistories)

const productsHistories = computed(() => {
  renderKey.value += 1
  return productHistoryStore.productHistories
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
      const productName = `${row.original.name}`;
      const packaging = `(${row.original.packaging})`;
      const lendBadge = row.original.toLend ? h('span', { class: 'w-fit bg-red-600 mx-2 text-white rounded-lg px-2 py-1 text-sm' }, t('toLend')) : null;
      return h('div', { style: { display: 'flex', flexDirection: 'column' } }, [
        h('span', {}, productName),
        h('span', {}, packaging),
        h('span', {}, lendBadge),
      ]);
    },
  },
  {
    accessorKey: 'quantity',
    header: t('quantity'),
  },
  {
    accessorKey: 'sold',
    header: t('sold'),
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
    cell: ({ row }) => calcPercentOfSale(row.original.purchasePrice, row.original.price) + '%',
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
      h('abbr', { title: t('utilize') }, [
        h(UtilizeIcon, { onClick: ($event) => { openPopup($event, row.original.id, row.original.rest, row.original.name) }, class: 'w-6 h-6 text-blue-600 hover:scale-105 cursor-pointer' }, {
          modelValue: switchStates[row.original.id],
          'onUpdate:modelValue': (value) => {
            switchStates[row.original.id] = value;
            // utilizeProduct(row.original.id, row.original.rest);
          }
        }),
      ]),
    ]),
    enableSorting: false,
  },
]
const switchStates = reactive({});
const utilizeProduct = (id, quantity) => {
  ProductService.utilizeProduct({
    productId: id,
    quantity: quantity,
  })
    .then(() => {
      toast.success(t('productUtilizedSuccessfully'))
      ProductService.getProductsDetails({ limit: pageSize, page: currentPage2.value, name: route.query.search })
        .then((res) => {
          useProductHistoryStore().clearStore()
          useProductHistoryStore().totalHistories = res.total
          useProductHistoryStore().setProductHistories(res.data)
        })
    })
    .catch(() => {
      toast.error(t('errorWhileUtilizingProduct'))
    })
}

const printLabel = (product) => {
  const quantity = product.saleType.includes('kg') ? 1000 : 1
  const barcode = !product.barcode ? `999${String(product.serialId).padStart(5, '0')}${String(quantity).padStart(4, '0')}1` : product.barcode
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
      }),
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

const openUtilizeProductModal = (id, rest) => {
  useModalStore().openUtilizeProductModal()
  useProductHistoryStore().setUtilizeData(id, rest)
}

const getProductHistories = async (filters = {}) => {
  isLoading.value = true
  await ProductService.getProductsDetails(
    cleanObjectEmptyFields({ limit: pageSize, page: page.value, ...filters }),
  ).then((res) => {
    useProductHistoryStore().clearStore()
    useProductHistoryStore().totalHistories = res.total
    useProductHistoryStore().setProductHistories(res.data)
    useProductHistoryStore().currentPage = page.value
  }).finally(() => isLoading.value = false)
}

const getSort = (sortBy, sortOrder) => {
  filterData.sortBy = sortBy
  filterData.sortOrder = sortOrder
  getProductHistories(filterData)
  useDropdownStore().toggleSortBy()
}

const getRemainingProducts = (data) => {
  filterData.remainingProducts = data
  getProductHistories(filterData)
  useDropdownStore().toggleSortBy()
}

const resetSortData = () => {
  clearFilterData()
  getProductHistories(filterData)
  useDropdownStore().toggleSortBy()
}

const submitFilterData = async () => {
  isLoading.value = true
  if (!filterData.startExpirationDate && !filterData.endExpirationDate) {
    toast.error('Kamida bitta vaqtni tanlang')
  } else {
   await getProductHistories(filterData)
    useDropdownStore().toggleFilterBy()
  }
}

// const debounce = (fn, delay) => {
//   let timerId
//   return (...args) => {
//     if (timerId) {
//       clearTimeout(timerId)
//     }
//     timerId = setTimeout(() => {
//       fn(...args)
//     }, delay)
//   }
// }

const searchProducts = (async () => {
  const query = searchFilter.value.trim() ? { search: searchFilter.value } : {}
  await router.push({ query })
  const trimmedValue = searchFilter.value.trim()
  let filters = {}
  if (trimmedValue === '') {
    await getProductHistories({ limit: pageSize, page: currentPage.value })
    return
  }
  if (!isNaN(trimmedValue)) {
    if (trimmedValue.startsWith('999')) {
      filters = { name: String(trimmedValue) }
    } else if (isBarcode(trimmedValue)) {
      filters = { barcode: trimmedValue }
    } else if (/^\d{1,8}$/.test(trimmedValue)) {
      filters = {serialId: parseInt(trimmedValue)}
    } else {
      filters = { name: trimmedValue }
    }
  } else {
    filters = { name: trimmedValue }
  }
  await getProductHistories({ limit: pageSize, page: 1, ...filters })
})

const goToPage = async (pageNumber) => {
  page.value = pageNumber
  await getProductHistories()
}

const prevPage = async () => {
  if (page.value > 1) {
    page.value -= 1
    await getProductHistories()
  }
}

const nextPage = async () => {
  if (page.value < totalPages.value) {
    page.value += 1
    await getProductHistories()
  }
}

const totalPages = computed(() => {
  return Math.ceil(total.value / pageSize)
})

const displayedPageNumbers = computed(() => {
  const pageCount = totalPages.value;
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  } else {
    const currentPage = page.value;
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    } else if (currentPage >= pageCount - 2) {
      return [
        pageCount - 4,
        pageCount - 3,
        pageCount - 2,
        pageCount - 1,
        pageCount,
      ];
    } else {
      return [
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
      ];
    }
  }
});

watch(page, async () => {
  await getProductHistories(filterData)
})

watch(searchFilter, async () => {
  if (searchFilter.value === '') {
    await getProductHistories({ limit: pageSize, page: currentPage.value })
  }
})

// watch(searchFilter, searchProducts)

const navigationGuard = (access) => {
  return payload.value?.privileges?.includes(access)
}

const createDuplicateProductModal = (data) => {
  useModalStore().openCreateProductModal()
  useProductHistoryStore().setSelectedProductHistory(data)
}

onMounted(async () => {
  useAuthStore().setUser(decodeJwt(JSON.parse(localStorage.getItem('session'))?.accessToken))
  payload.value = parseJwt()
  if (route.query.search) {
    searchFilter.value = route.query.search
  }
  await getProductHistories();
})

watch(route, async (newRoute) => {
  if (newRoute.query.search) {
    searchFilter.value = newRoute.query.search
  } else {
    searchFilter.value = ''
    await getProductHistories();
  }
})

watchEffect(() => {
  if (onSearchFocus.value) {
    onSearchFocus.value.focus()
  }
})

const confirm = useConfirm();
const isVisible = ref(false);
const openPopup = (event, id, quantity, name) => {
  confirm.require({
    message: t('beginText') + `${name}` + t('endText'),
    header: t('utilize'),
    onShow: () => {
      isVisible.value = true;
    },
    onHide: () => {
      isVisible.value = false;
    },
    ricon: 'icon-delete',
    rejectLabel: t('no'),
    rejectClass: 'text-slate-600 bg-white hover:bg-slate-100 focus:outline-none focus:ring-white rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 hover:text-slate-900',
    acceptLabel: t('yesOfCourse'),
    acceptClass: 'ml-4 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-white rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5',
    accept: () => {
      utilizeProduct(id, quantity)
    },
    reject: () => { }
  });
}

const onChange = (event) => {
  checked.value = event.value
}
</script>
<template>
  <div class="p-4 md:p-8">
    <ConfirmDialog />
    <div class="flex md:flex-row flex-col items-center justify-between space-y-4 md:space-y-0 mb-6">
      <div class="text-slate-900 text-2xl md:text-3xl font-semibold">
        {{ $t('incomeExpense') }}
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
    <div class="flex md:flex-row flex-col items-center justify-between">
      <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400" />
        </div>
        <input type="search" v-model="searchFilter"   @keyup.enter="searchProducts" ref="onSearchFocus"
               class="bg-slate-100 border-none w-full text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
               placeholder="Search everything...">
      </div>
      <div class="w-full md:w-auto order-1 md:order-2 flex space-x-2">
        <div class="relative w-auto" ref="filterByDropdown">
          <div @click="useDropdownStore().toggleFilterBy()"
               class="border-none select-none text-gray-500 bg-slate-100 rounded-full w-full p-2 px-5 flex items-center hover:bg-gray-200 cursor-pointer space-x-1">
            <FunnelIcon class="w-5 h-5 text-gray-400" />
            <span>{{ $t('filter') }}</span>
          </div>
          <div v-if="useDropdownStore().isOpenFilterBy"
               class="absolute bg-white shadow-md rounded-xl w-64 p-3 z-20 top-12 right-0 space-y-3">
            <div class="flex-1 space-y-1">
              <label for="startExpirationDate" class="text-base md:text-lg font-medium">
                {{ $t('from') }}
              </label>
              <input id="startExpirationDate" type="date" v-model="filterData.startExpirationDate"
                     class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
                     :placeholder="t('enterProductQuantity')">
            </div>
            <div class="flex-1 space-y-1">
              <label for="endExpirationDate" class="text-base md:text-lg font-medium">
                {{ $t('to') }}
              </label>
              <input id="endExpirationDate" type="date" v-model="filterData.endExpirationDate"
                class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
                :placeholder="t('enterProductQuantity')">
            </div>
            <div class="flex items-center space-x-2">
              <div @click="clearFilterData()"
                class="bg-blue-500 hover:bg-blue-600 cursor-pointer select-none py-2 px-3 text-white rounded-lg flex items-center justify-center">
                <BroomIcon class="w-5 h-5 text-white" />
              </div>
              <div v-if="isLoading"
                 class="w-full bg-blue-600 py-2 select-none text-white rounded-lg flex items-center justify-center">
              <Spinners270RingIcon
                class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
              <span>{{ $t('loading') }}</span>
            </div>
            <div v-else @click="submitFilterData()"
                 class="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer select-none py-2 text-white rounded-lg flex items-center justify-center">
              <span>{{ $t('filter') }}</span></div>
            </div>
          </div>
        </div>
        <div class="relative w-auto" ref="sortByDropdown">
          <div @click="useDropdownStore().toggleSortBy()"
            class="border-none select-none text-gray-500 bg-slate-100 rounded-full w-full p-2 px-5 flex items-center hover:bg-gray-200 cursor-pointer space-x-1">
            <FunnelIcon class="w-5 h-5 text-gray-400" />
            <span>{{ sortByOption || $t('sorting') }}</span>
          </div>
          <div v-if="useDropdownStore().isOpenSortBy"
            class="absolute bg-white shadow-md rounded-xl w-52 p-3 z-20 top-18 right-0 space-y-3">
            <ul>
              <li @click="resetSortData(); sortByOption = $t('standard')"
                class="px-2 py-1 text-sm hover:bg-slate-100 rounded cursor-pointer">
                {{ $t('standard') }}
              </li>
              <li @click="getRemainingProducts(true); sortByOption = $t('remainingProducts')"
                class="px-2 py-1 text-sm hover:bg-slate-100 rounded cursor-pointer">
                {{ $t('remainingProducts') }}
              </li>
              <li @click="getSort('name', 'ASC'); sortByOption = $t('byName') + ' (A-Z)'"
                class="px-2 py-1 text-sm hover:bg-slate-100 rounded cursor-pointer">
                {{ $t('byName') }} (A-Z)
              </li>
              <li @click="getSort('name', 'DESC'); sortByOption = $t('byName') + ' (Z-A)'"
                class="px-2 py-1 text-sm hover:bg-slate-100 rounded cursor-pointer">
                {{ $t('byName') }} (Z-A)
              </li>
              <li @click="getSort('price', 'ASC'); sortByOption = $t('byPrice') + ' (arzoni)'"
                class="px-2 py-1 text-sm hover:bg-slate-100 rounded cursor-pointer">
                {{ $t('byPrice') }} (arzoni)
              </li>
              <li @click="getSort('price', 'DESC'); sortByOption = $t('byPrice') + ' (qimmati)'"
                class="px-2 py-1 text-sm hover:bg-slate-100 rounded cursor-pointer">
                {{ $t('byPrice') }} (qimmati)
              </li>
              <li @click="getSort('quantity', 'ASC'); sortByOption = $t('byQuantity') + ' (ozi)'"
                class="px-2 py-1 text-sm hover:bg-slate-100 rounded cursor-pointer">
                {{ $t('byQuantity') }} (ozi)
              </li>
              <li @click="getSort('quantity', 'DESC'); sortByOption = $t('byQuantity') + ` (ko'pi)`"
                class="px-2 py-1 text-sm hover:bg-slate-100 rounded cursor-pointer">
                {{ $t('byQuantity') }} `ko'pi`
              </li>
              <li @click="getSort('production_date', 'ASC'); sortByOption = $t('byProductionDate') + ' (eski)'"
                class="px-2 py-1 text-sm hover:bg-slate-100 rounded cursor-pointer">
                {{ $t('byProductionDate') }} (eski)
              </li>
              <li @click="getSort('production_date', 'DESC'); sortByOption = $t('byProductionDate') + ' (yangi)'"
                class="px-2 py-1 text-sm hover:bg-slate-100 rounded cursor-pointer">
                {{ $t('byProductionDate') }} (yangi)
              </li>
              <li @click="getSort('expiration_date', 'ASC'); sortByOption = $t  ('byExpirationDate') + ' (eski)'"
                class="px-2 py-1 text-sm hover:bg-slate-100 rounded cursor-pointer">
                {{ $t('byExpirationDate') }} (eski)
              </li>
              <li @click="getSort('expiration_date', 'DESC'); sortByOption = $t('byExpirationDate') + ' (yangi)'"
                class="px-2 py-1 text-sm hover:bg-slate-100 rounded cursor-pointer">
                {{ $t('byExpirationDate') }} (yangi)
              </li>
            </ul>
          </div>
        </div>
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
