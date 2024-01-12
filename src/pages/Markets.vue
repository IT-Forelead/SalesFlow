<script setup>
import { h } from 'vue'
import CTable from '../components/common/CTable.vue'
import moment from 'moment'
import cars from '/public/markets.json'
import EditProductModal from '../components/modals/EditProductModal.vue'
import DeleteProductModal from '../components/modals/DeleteProductModal.vue'

const columnsCars = [
  {
    accessorKey: 'id',
    header: 'ID',
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: "Do'kon nomi",
  },
  {
    accessorKey: 'owner',
    header: "Egasi",
  },
  {
    accessorFn: row => `${row.address}, ${row.cown}, ${row.region}`,
    header: 'Manzili',
  },
  {
    accessorKey: 'createdAt',
    accessorFn: row => moment(row.createdAt).format('DD/MM/YYYY H:mm'),
    header: 'Yaratilgan vaqti',
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
  <div class="container mx-auto">
    <div class="overflow-auto bg-white rounded-3xl shadow">
      <CTable :data="cars" :columns="columnsCars" />
    </div>
  </div>
</template>
