<script setup>
import { computed } from '@vue/reactivity'
import { h, onMounted } from 'vue'
import TotalProductIcon from '../assets/icons/TotalProductIcon.vue'
import CTable from '../components/common/CTable.vue'
import EditProductModal from '../components/modals/EditProductModal.vue'
import DeleteProductModal from '../components/modals/DeleteProductModal.vue'
import ProductService from '../services/product.service'
import { useProductStore } from '../store/product.store'

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
    accessorFn: row => `${row.value} ${row.type}`,
    header: "O'lchov turi",
  },
  {
    accessorKey: 'barcode',
    header: 'Barcode',
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

const products = computed(() => {
  return useProductStore().products
})

onMounted(() => {
  ProductService.getProducts({})
    .then((res) => {
      useProductStore().clearStore()
      useProductStore().setProducts(res)
    })
})
</script>

<template>
  <div class="container mx-auto">
    <div class="flex flex-row space-x-10 mb-5">
      <div class="flex items-center px-4 basis-1/4 h-32 bg-white rounded-3xl">
        <div class="flex items-center justify-center w-20 h-20 bg-violet-100 rounded-full">
          <TotalProductIcon class="w-8 h-8 text-blue-500" />
        </div>
        <div class="px-4 flex flex-col">
          <div class="text-slate-400 text-base font-normal">Umumiy mahsulotlar</div>
          <div class="text-neutral-800 text-xl font-semibold">50,000</div>
        </div>
      </div>
      <div class="flex items-center px-4 basis-1/4 h-32 bg-white rounded-3xl">
        <div class="flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full">
          <TotalProductIcon class="w-8 h-8 text-amber-400" />
        </div>
        <div class="px-4 flex flex-col">
          <div class="text-slate-400 text-base font-normal">Umumiy mahsulotlar</div>
          <div class="text-neutral-800 text-xl font-semibold">50,000</div>
        </div>
      </div>
      <div class="flex items-center px-4 basis-1/4 h-32 bg-white rounded-3xl">
        <div class="flex items-center justify-center w-20 h-20 bg-rose-100 rounded-full">
          <TotalProductIcon class="w-8 h-8 text-pink-400" />
        </div>
        <div class="px-4 flex flex-col">
          <div class="text-slate-400 text-base font-normal">Umumiy mahsulotlar</div>
          <div class="text-neutral-800 text-xl font-semibold">50,000</div>
        </div>
      </div>
      <div class="flex items-center px-4 basis-1/4 h-32 bg-white rounded-3xl">
        <div class="flex items-center justify-center w-20 h-20 bg-sky-100 rounded-full">
          <TotalProductIcon class="w-8 h-8 text-teal-400" />
        </div>
        <div class="px-4 flex flex-col">
          <div class="text-slate-400 text-base font-normal">Umumiy mahsulotlar</div>
          <div class="text-neutral-800 text-xl font-semibold">50,000</div>
        </div>
      </div>
    </div>
    <div class="overflow-auto bg-white rounded-3xl shadow">
      <CTable :data="products" :columns="columns" />
    </div>
  </div>
</template>
