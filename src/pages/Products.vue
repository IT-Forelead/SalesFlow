<script setup>
import { computed, h, ref, watch } from 'vue'
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

const { t } = useI18n()
const globalSearchFromTable = ref('')
const isLoading = ref(false)
const renderKey = ref(0)
const productStore = useProductStore()

const products = computed(() => {
  renderKey.value += 1
  return productStore.products
})
const total = computed(() => {
  return productStore.total
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
      return 'ta'
    case 'litre':
      return 'litr'
    case 'kg':
      return 'kg'
    case 'g':
      return 'g'
  }
}

const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
    enableSorting: false,
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
  },
  {
    accessorKey: 'name',
    header: 'Nomi',
  },
  {
    accessorKey: 'packaging',
    header: 'Qadoqi',
  },
  {
    accessorKey: 'barcode',
    header: 'Barcode',
  },
  {
    accessorKey: 'quantity',
    header: 'Miqdori',
    accessorFn: row => `${row.quantity} ${saleTypeShortTranslate(row.saleType)}`,
  },
  {
    accessorKey: 'saleType',
    header: 'Sotilish turi',
    accessorFn: row => `${saleTypeTranslate(row.saleType)}`,
  },
  {
    accessorKey: 'price',
    accessorFn: row => `${useMoneyFormatter(row.price)}`,
    header: 'Narxi',
  },
  {
    accessorKey: 'actions',
    header: 'Amallar',
    cell: ({ row }) => h('div', { class: 'flex items-center space-x-2' }, [
      h('button', {
        onClick: () => {
          openEditProductModal(row.original)
        },
      }, [
        h(EditIcon, { class: 'w-6 h-6 text-blue-600 hover:scale-105' }),
      ]),
      h('button', {
        onClick: () => {
          openDeleteProductModal(row.original)
        },
      }, [
        h(TrashIcon, { class: 'w-6 h-6 text-red-600 hover:scale-105' }),
      ]),
    ]),
    enableSorting: false,
  },
]

const openEditProductModal = (data) => {
  useModalStore().openEditProductModal()
  useProductStore().setSelectedProduct(data)
}

const openDeleteProductModal = (data) => {
  useModalStore().openDeleteProductModal()
  useProductStore().setSelectedProduct(data)
}

const page = ref(1)
const pageSize = 30
const getProducts = () => {
  isLoading.value = true
  ProductService.getProducts({limit: pageSize, page: page.value})
    .then((res) => {
      useProductStore().clearStore()
      useProductStore().total = res.total
      useProductStore().setProducts(res.data)
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

getProducts()

watch(page, () => {
  getProducts()
})
</script>

<template>
  <div class="p-4 md:p-8">
    <div class="text-slate-900 text-2xl md:text-3xl font-semibold mb-6">
      Mahsulotlar
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
      <div class="w-full md:w-auto order-1 md:order-2">
        <button @click="useModalStore().openCreateProductModal()"
                class="w-full md:w-auto py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          Mahsulot qo'shish
        </button>
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
        <button
          :disabled="page === 1"
          @click="goToPage(1)"
          class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
          <CaretDoubleLeftIcon class="w-5 h-5" />
        </button>
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
          <CaretLeftIcon class="w-5 h-5" />
        </button>
        <div class="flex items-center space-x-2">
          <button
            v-for="pageNumber in displayedPageNumbers"
            :key="pageNumber"
            @click="goToPage(pageNumber)"
            :class="{'bg-blue-600 text-white': pageNumber === page, 'hover:bg-blue-200': pageNumber !== page }"
            class="px-3 py-2 select-none rounded-lg text-slate-900 text-center text-base font-medium transition-all">
            {{ pageNumber }}
          </button>
        </div>
        <button
          @click="nextPage"
          :disabled="page === totalPages"
          class="flex items-center gap-2 px-3 py-2 text-base font-medium text-center text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
          <CaretRightIcon class="w-5 h-5" />
        </button>
        <button
          :disabled="page === totalPages"
          @click="goToPage(totalPages)"
          class="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
          <CaretDoubleRightIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>
