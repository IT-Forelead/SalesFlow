<script setup>
import { ref } from 'vue'
import { computed, h } from 'vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import CTable from '../components/common/CTable.vue'
import { useModalStore } from '../store/modal.store'
import { useProductHistoryStore } from '../store/productHistory.store.js'
import ProductHistoryService from '../services/productHistory.service.js'
import { useProductStore } from '../store/product.store.js'
import useMoneyFormatter from '../mixins/currencyFormatter.js'
import ProductService from '../services/product.service.js'
import EditIcon from '../assets/icons/EditIcon.vue'
import TrashIcon from '../assets/icons/TrashIcon.vue'

const globalSearchFromTable = ref('')
const isLoading = ref(false)
const productHistoryStore = useProductHistoryStore()
const renderKey = ref(0)

const productsHistories = computed(() => {
  renderKey.value += 1
  return productHistoryStore.productHistories
})

const productStore = useProductStore()
const getProductName = (productId) => {
  const product = productStore.products.find(product => product.id === productId);
  return product?.name + " - " + product?.packaging || 'Mahsulot nomi yo\'q';
};

const getProducts = () => {
  ProductService.getProducts({})
    .then((res) => {
      useProductStore().clearStore();
      useProductStore().setProducts(res);
    })
    .catch(() => {
      toast.error('Failed to fetch products');
    });
}

getProducts(); // Fetch product data

const getHistoryType = (historyType) => {
  switch (historyType){
    case 'purchased':
      return 'Kirim'
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
    cell: ({row}) => getProductName(row.getValue('productId'))
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
    cell: ({ row }) => h('div', { class: 'flex items-center space-x-2' }, [
      h('button', { onClick: () => { openEditProductHistoryModal(row.original) } }, [
        h(EditIcon, { class: 'w-6 h-6 text-blue-600 hover:scale-105' })
      ]),
      h('button', { onClick: () => { openDeleteProductHistoryModal(row.original) } }, [
        h(TrashIcon, { class: 'w-6 h-6 text-red-600 hover:scale-105' })
      ]),
    ]),
    enableSorting: false,
  },
]

const openEditProductHistoryModal = (data) => {
  useModalStore().openEditProductHistoryModal()
  useProductHistoryStore().setSelectedProductHistory(data)
}

const openDeleteProductHistoryModal = (data) => {
  useModalStore().openDeleteProductHistoryModal()
  useProductHistoryStore().setSelectedProductHistory(data)
}

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
  <div class="p-4 md:p-8">
    <div class="text-slate-900 text-2xl md:text-3xl font-semibold mb-6">
      Mahsulot tarixlari
    </div>
    <div class="flex md:flex-row flex-col items-center justify-between">
      <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400" />
        </div>
        <input type="search" v-model="globalSearchFromTable"
               class="bg-slate-100 border-none w-full text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
               placeholder="Search everything...">
      </div>
      <div class="w-full md:w-auto order-1 md:order-2">
        <button @click="useModalStore().openCreateProductHistoryModal()"
                class="w-full md:w-auto py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          Mahsulot tarixi qo'shish
        </button>

      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 animate-spin" />
    </div>
    <CTable v-else :data="productsHistories" :key="renderKey" :columns="columns" :filter="globalSearchFromTable" />
  </div>
</template>
