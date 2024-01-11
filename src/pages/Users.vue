<script setup>
import { h } from 'vue'
import TotalProductIcon from '../assets/icons/TotalProductIcon.vue'
import CTable from '../components/common/CTable.vue'
import moment from 'moment'
import cars from '/public/users.json'
import EditButton from '../components/buttons/EditButton.vue'
import DeleteButton from '../components/buttons/DeleteButton.vue'

const columnsCars = [
  {
    accessorKey: 'id',
    header: 'ID',
    enableSorting: false,
  },
  {
    accessorKey: 'login',
    header: 'Login',
  },
  {
    accessorFn: row => `${row.firstname} ${row.lastname}`,
    header: 'Foydalanuvchi',
  },
  {
    accessorKey: 'phone',
    header: 'Telefon raqami',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'createdAt',
    accessorFn: row => moment(row.createdAt).format('DD/MM/YYYY H:mm'),
    header: 'Yaratilgan vaqti',
  },
  {
    accessorKey: 'active',
    header: 'Active',
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
    <div class="overflow-auto border border-gray-200 bg-white rounded-3xl shadow">
      <CTable :data="cars" :columns="columnsCars" />
    </div>
  </div>
</template>
