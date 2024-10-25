<script setup>
import { h, ref } from 'vue'
import CTable from '../components/common/CTable.vue'
import cars from '/public/cars.json'
import EditProductModal from '../components/modals/EditProductModal.vue'
import DeleteProductModal from '../components/modals/DeleteProductModal.vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import moment from 'moment'

const globaleSearchFromTable = ref('')

const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
    enableSorting: false,
  },
  {
    accessorKey: 'car_make',
    header: 'Mahsulot nomi',
  },
  {
    accessorKey: 'car_model',
    header: 'Mahsulot turi',
  },
  {
    accessorKey: 'car_year',
    header: 'Ishlan chiqarilgan sana',
  },
  {
    accessorKey: 'price',
    header: 'Narxi',
  },
  {
    accessorKey: 'createdAt',
    accessorFn: row => moment(row.createdAt).format('DD/MM/YYYY H:mm'),
    header: t('createdAt'),
  },
  {
    accessorKey: 'edit',
    header: 'Amallar',
    cell: ({ row }) => h('button', { class: 'flex space-x-2' }, [
      h(EditProductModal, { id: row.original.id }),
      h(DeleteProductModal, { id: row.original.id }),
    ]),
    enableSorting: false,
  },
]
</script>

<template>
  <div class="bg-white rounded-3xl shadow px-4 py-4 lg:px-8">
    <div class="flex items-center justify-between my-2">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400" />
        </div>
        <input type="search" v-model="globaleSearchFromTable"
          class="bg-slate-100 border-none text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
          placeholder="Search everything...">
      </div>
      <div>
        <button class="w-full py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          Mahsulot qo'shish
        </button>
      </div>
    </div>
    <CTable :data="cars" :columns="columns" :filter="globaleSearchFromTable" />
  </div>
</template>
