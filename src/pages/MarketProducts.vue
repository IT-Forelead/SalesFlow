<script setup>
import { h } from 'vue'
import TotalProductIcon from '../assets/icons/TotalProductIcon.vue'
import CTable from '../components/common/CTable.vue'
import cars from '/public/cars.json'
import EditButton from '../components/buttons/EditButton.vue'
import DeleteButton from '../components/buttons/DeleteButton.vue'

const columnsCars = [
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
    accessorKey: 'edit',
    header: 'Amallar',
    cell: ({ row }) => h('button', { class: 'flex space-x-2' }, [
      h(EditButton, { id: row.original.id }),
      h(DeleteButton, { id: row.original.id }),
    ]),
    enableSorting: false,
  },
]
</script>

<template>
  <div class="container mx-auto">
    <div class="overflow-auto bg-white rounded-3xl shadow">
      <CTable :data="cars" :columns="columnsCars" />
    </div>
  </div>
</template>
