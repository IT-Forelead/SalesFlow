<script setup>
import { computed, h, ref } from 'vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import CTable from '../components/common/CTable.vue'
import DeleteProductModal from '../components/modals/DeleteProductModal.vue'
import EditProductModal from '../components/modals/EditProductModal.vue'
import ProductService from '../services/product.service'
import PhTrash from '../assets/icons/TrashIcon.vue'
import PhPencilIcon from '../assets/icons/EditIcon.vue'
import { useModalStore } from '../store/modal.store'
import { useProductStore } from '../store/product.store'
import useMoneyFormatter from '../mixins/currencyFormatter'

const globalSearchFromTable = ref('')
const isLoading = ref(false)
const renderKey = ref(0)
const productStore = useProductStore()

const products = computed(() => {
  renderKey.value += 1
  return productStore.products
})
const saleTypeTranslate = (type) => {
  switch (type){
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
  },
  {
    accessorKey: 'saleType',
    header: 'Sotilish turi',
    accessorFn: row => `${ saleTypeTranslate(row.saleType) }`,
  },
  {
    accessorKey: 'price',
    accessorFn: row => `${ useMoneyFormatter(row.price) }`,
    header: 'Narxi',
  },
  {
    accessorKey: 'actions',
    header: 'Amallar',
    cell: ({ row }) => h('div', { class: 'flex items-center space-x-2' }, [
            h('button', { onClick: () => {openEditProduct(row.original)} }, [
                h(PhPencilIcon, {class: 'w-6 h-6 text-blue-600 hover:scale-105'})
            ]),
            h('button', { onClick: () => { openDeleteProductModal(row.original) } }, [
              h(PhTrash, { class: 'w-6 h-6 text-red-600 hover:scale-105' })
            ]),
    ]),
    enableSorting: false,
  },
]

const openEditProduct = (data) => {
  useProductStore().setSelectedProduct(data)
  useModalStore().openEditProductModal()
}

const openDeleteProductModal = (data) => {
  useModalStore().openDeleteProductModal()
  useProductStore().setSelectedProduct(data)
}

const getProducts = () => {
  isLoading.value = true
  ProductService.getProducts({})
    .then((res) => {
      useProductStore().clearStore()
      useProductStore().setProducts(res)
    }).finally(() => {
      isLoading.value = false
    })
}

getProducts()
</script>

<template>
  <div class="p-8">
    <div class="text-slate-900 text-2xl md:text-3xl font-semibold mb-6">
      Mahsulotlar
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
        <button @click="useModalStore().openCreateProductModal()"
          class="w-full py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          Mahsulot qo'shish
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 animate-spin" />
    </div>
    <CTable v-else :data="products" :key="renderKey" :columns="columns" :filter="globalSearchFromTable" />
  </div>
</template>
