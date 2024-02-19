<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
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

const globalSearchFromTable = ref('')
const isLoading = ref(false)
const renderKey = ref(0)
const productStore = useProductStore()

const productBarcodes = computed(() => {
  renderKey.value += 1
  return productStore.productBarcodes
})

const emit = defineEmits(['next', 'prev'])

const columns = [
  {
    accessorKey: 'id',
    header: '#',
    enableSorting: false,
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
  },
  // {
  //   accessorKey: 'type',
  //   header: 'Turi',
  //   accessorFn: row => `${row?.type} - ${row?.sub_type }`,
  // },
  // {
  //   accessorKey: 'name',
  //   header: 'Nomi',
  // },
  {
    accessorKey: 'trademark',
    header: 'Savdo belgisi',
  },
  {
    accessorKey: 'packaging',
    header: 'Qadoqi',
  },
  {
    accessorKey: 'type_code',
    header: 'Kod turi',
  },
  {
    accessorKey: 'barcode',
    header: 'Shtrix kodi',
  },
  // {
  //   accessorKey: 'reg_number',
  //   header: "Registratsiya raqami",
  // },
  {
    accessorKey: 'year',
    header: 'Yil',
  },
]
const total = ref(1)
const page = ref(1)
const pageSize = 30
const getBarcodes = () => {
  isLoading.value = true
  ProductService.getBarcodes(pageSize, page.value)
    .then((response) => {
      total.value = response.total
      useProductStore().clearStore()
      useProductStore().setProductBarcodes(response.data)
    }).finally(() => {
    isLoading.value = false
  })
}


const totalPages = computed(() => Math.ceil(total.value / 30))
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

getBarcodes()

watch(page, () => {
  getBarcodes()
})

</script>
<template>
  <div class="p-4 md:p-8">
    <div class="text-slate-900 text-2xl md:text-3xl font-semibold mb-6">Shtrix kodlar</div>
    <div class="flex flex-col md:flex-row items-center justify-between">
      <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400" />
        </div>
        <input type="search" v-model="globalSearchFromTable"
               class="bg-slate-100 border-none w-full text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
               placeholder="Search everything..." />
      </div>
      <div class="w-full md:w-auto order-1 md:order-2">
        <button @click="useModalStore().openCreateProductBarcodeModal()"
                class="w-full md:w-auto py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          Shtrix kod qo'shish
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 animate-spin" />
    </div>
    <BarcodesTable v-else :data="productBarcodes" :key="renderKey" :columns="columns" :filter="globalSearchFromTable" />

    <div class="flex items-center justify-between my-6">
      <div class="text-base text-slate-900 font-medium">
        Jami:
        {{ total }}
      </div>
      <div class="flex items-center space-x-2">
        <button
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
            :class="{
        'bg-blue-600 text-white': pageNumber === page,
        'hover:bg-blue-200': pageNumber !== page,
      }"
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
          @click="goToPage(totalPages)"
          class="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
          <CaretDoubleRightIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>
