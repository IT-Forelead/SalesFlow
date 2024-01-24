<script setup>
import { ref } from '@vue/reactivity'
import { computed, h } from 'vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import CTable from '../components/common/CTable.vue'
import DeleteProductModal from '../components/modals/DeleteProductModal.vue'
import EditProductModal from '../components/modals/EditProductModal.vue'
import { useModalStore } from '../store/modal.store'
import { useProductHistoryStore } from '../store/productHistory.store.js'
import ProductHistoryService from '../services/productHistory.service.js'
import { useProductStore } from '../store/product.store.js'
import useMoneyFormatter from '../mixins/currencyFormatter.js'

const globalSearchFromTable = ref('')
const isLoading = ref(false)
const productHistoryStore = useProductHistoryStore()

const productsHistories = computed(() => {
  return productHistoryStore.productHistories
})

const productStore = useProductStore()
const getProductName = (productId) => {
  const product = productStore.products.find(product => product.id === productId);
  return product?.name || 'Mahsulot nomi yo\'q';
};


const getHistoryType = (historyType) => {
  switch (historyType){
    case 'purchased':
      return 'Sotib olingan'
    case 'returned':
      return 'Qaytarilgan'
    default:
      return "Turi yo'q"
  }
}

const columns = [
  {
    accessorKey: 'id',
    header: 'N',
    enableSorting: false,
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
  },
  {
    accessorKey: 'productId',
    header: 'Mahsulot nomi',
    cell: ({row}) => getProductName(row.original.productId)
  },
  {
    accessorKey: 'quantity',
    header: 'Miqdori',
  },
  {
    accessorKey: 'historyType',
    header: 'Mahsulot tarixi turi',
    cell: ({row}) => getHistoryType(row.original.historyType)
  },
  {
    accessorKey: 'purchasePrice',
    header: 'Sotib olingan narxi',
    cell: ({row}) => useMoneyFormatter(row.original.purchasePrice)
  },
  {
    accessorKey: 'salePrice',
    header: 'Sotish narxi',
    cell: ({row}) => useMoneyFormatter(row.original.salePrice)
  },
  {
    accessorKey: 'actions',
    header: 'Amallar',
    cell: ({ row }) => h('button', { class: 'flex space-x-2' }, [
      h(EditProductModal, { id: row.original.id }),
      h(DeleteProductModal, { id: row.original.id }),
    ]),
    enableSorting: false,
  },
]

const getProductHistories = () => {
  isLoading.value = true
  ProductHistoryService.getProductHistories({})
    .then((res) => {
      useProductHistoryStore().clearStore()
      useProductHistoryStore().setProductHistories(res)
    }).finally(() => {
    isLoading.value = false
  })
}
getProductHistories()
</script>
<template>
  <div class="p-8">
    <div class="text-slate-900 text-2xl md:text-3xl font-semibold mb-6">
      Mahsulot tarixlari
    </div>
    <div class="flex items-center justify-between my-2">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400" />
        </div>
        <input type="search" v-model="globalSearchFromTable"
               class="bg-slate-100 border-none text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
               placeholder="Search everything...">
      </div>
      <div>
        <button @click="useModalStore().openCreateProductHistoriyModal()"
                class="w-full py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          Mahsulot tarixi qo'shish
        </button>

      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 animate-spin" />
    </div>
    <CTable v-else :data="productsHistories" :columns="columns" :filter="globalSearchFromTable" />
  </div>
</template>
