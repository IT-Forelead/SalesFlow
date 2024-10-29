<script setup>
import { computed, h, ref, watch, watchEffect } from 'vue'
import ProductService from '../services/product.service.js'
import { useModalStore } from '../store/modal.store'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import { useProductStore } from '../store/product.store'
import CaretDoubleRightIcon from '../assets/icons/CaretDoubleRightIcon.vue'
import CaretRightIcon from '../assets/icons/CaretRightIcon.vue'
import CaretDoubleLeftIcon from '../assets/icons/CaretDoubleLeftIcon.vue'
import CaretLeftIcon from '../assets/icons/CaretLeftIcon.vue'
import BarcodesTable from '../components/common/BarcodesTable.vue'
import EditIcon from '../assets/icons/EditIcon.vue'
import { useI18n } from 'vue-i18n'
import moment from 'moment'

const { t } = useI18n()

const globalSearchFromTable = ref('')
const isLoading = ref(false)
const renderKey = ref(0)
const productStore = useProductStore()

const productBarcodes = computed(() => {
  renderKey.value += 1
  return productStore.productBarcodes
})
const total = computed(() => {
  return productStore.barcodesTotal
})

const columns = [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'cursor-default'}, t('n')),
    enableSorting: false,
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
  },
  {
    accessorKey: 'trademark',
    header: t('name'),
  },
  {
    accessorKey: 'packaging',
    header: t('package'),
  },
  {
    accessorKey: 'serialId',
    header: t('serialId'),
  },
  {
    accessorKey: 'type_code',
    header: t('barcodeType'),
  },
  {
    accessorKey: 'barcode',
    header: t('barcode'),
    cell: ({ row }) => {
      const barcode = row.original.barcode
      const uniqueBarcodes = Array.from(new Set(productStore.productBarcodes.map(item => item.barcode)))
      const indexInUniqueBarcodes = uniqueBarcodes.indexOf(barcode)
      const color = indexInUniqueBarcodes % 2 === 0 ? 'dark:white' : 'gray'
      return h('span', {
        style: { color },
      }, barcode)
    },
  },
  {
    accessorKey: 'year',
    header: t('year'),
  },
  {
    accessorKey: 'createdAt',
    accessorFn: row => moment(row.createdAt).format('DD/MM/YYYY H:mm'),
    header: t('createdAt'),
  },
  {
    accessorKey: 'actions',
    header: t('actions'),
    cell: ({ row }) => h('div', { class: 'flex justify-center items-center space-x-2' }, [
      h('button', { onClick: () => { openEditProductBarcodeModal(row.original) } }, [
        h(EditIcon, { class: 'w-6 h-6 text-blue-500 hover:scale-105' })
      ]),
    ]),
    enableSorting: false,
  },
]

const page = ref(1)
const pageSize = 30
const getDuplicates = () => {
  isLoading.value = true
  ProductService.getDuplicates(page.value, pageSize)
    .then((response) => {
      useProductStore().clearStore()
      useProductStore().barcodesTotal = response.total
      useProductStore().setProductBarcodes(response.data)
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

getDuplicates()

watch(page, () => {
  getDuplicates()
})

</script>
<template>
  <div class="p-4 md:p-8">
    <div class="dark:text-white text-slate-900 text-2xl md:text-3xl font-semibold mb-6">
      {{ $t('duplicates') }}
    </div>
    <div class="flex flex-col md:flex-row items-center justify-between">
      <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5" />
        </div>
        <input type="search" v-model="globalSearchFromTable"
          class="bg-slate-100 border-none w-full text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
          placeholder="Search everything..." />
      </div>
      <div class="w-full md:w-auto order-1 md:order-2">
      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 dark:text-zinc-300 animate-spin" />
    </div>
    <BarcodesTable v-else :data="productBarcodes" :key="renderKey" :columns="columns" :filter="globalSearchFromTable" />

    <div class="flex items-center justify-between my-6">
      <div class="text-base dark:text-white text-slate-900 font-medium">
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
          class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
          <CaretLeftIcon class="w-5 h-5" />
        </button>
        <div class="flex items-center space-x-2">
          <button v-for="pageNumber in displayedPageNumbers" :key="pageNumber" @click="goToPage(pageNumber)" :class="{
            'bg-blue-600 text-white': pageNumber === page,
            'hover:bg-blue-200': pageNumber !== page,
          }" class="px-3 py-2 select-none rounded-lg text-slate-900 dark:text-white text-center text-base font-medium transition-all">
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
