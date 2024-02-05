<script setup>
import { computed, ref } from 'vue'
import { h } from 'vue'
import moment from 'moment'
import { useProductStore } from '../store/product.store.js'
import ProductService from '../services/product.service.js'
// import SearchIcon from '../assets/i cons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import CTable from '../components/common/CTable.vue'

const globalSearchFromTable = ref('')
const renderKey = ref(0)
const productStore = useProductStore()
const barcodes = computed(() => {
  renderKey.value += 1
  return productStore.barcodes
})

const isLoading = ref(false)
const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
    enableSorting: false,
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
  },
  {
    accessorKey: 'type',
    header: 'Turi',
  },
  {
    accessorKey: 'subType',
    header: 'Kichik turi',
  },
  {
    accessorKey: 'name',
    header: 'Nomi',
  },
  {
    accessorKey: 'trademark',
    header: 'Savdo belgisi',
  },
  {
    accessorKey: 'packaging',
    header: 'Qadoqlash',
  },
  
  {
    accessorKey: 'typeCode',
    header: 'Kod turi',
  },
  {
    accessorKey: 'barcode',
    header: 'Raqamli mahsulot kodi',
  },
  {
    accessorKey: 'regNumber',
    header: "Ro'yxatdan o'tish raqami asl-shtrix-kod tartibi",
  },
  {
    accessorKey: 'year',
    header: 'Yil',
  },
]

const getBarcodes = () => {
  isLoading.value = true
  ProductService.getBarcodes()
    .then((res) => {
      useProductStore().clearStore()
      useProductStore().setProducts(res)
    }).finally(() => {
      isLoading.value = false
    })
}

getBarcodes()
</script>

<template>
  <div class="p-8">
    <div class="text-slate-900 text-2xl md:text-3xl font-semibold mb-6">Shtrix kodlar</div>
    <div class="flex items-center justify-between my-2">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400" />
        </div>
        <input type="search" v-model="globalSearchFromTable" class="bg-slate-100 border-none text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400" placeholder="Search everything..." />
      </div>
      <div>
        <button class="w-full py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">Shtrix kod qo'shish</button>
      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 animate-spin" />
    </div>
    <CTable v-else :data="barcodes" :columns="columns" :filter="globalSearchFromTable" />
  </div>
</template>
