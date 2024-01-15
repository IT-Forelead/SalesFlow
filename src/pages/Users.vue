<script setup>
import { computed } from '@vue/reactivity'
import { h, onMounted } from 'vue'
import CTable from '../components/common/CTable.vue'
import moment from 'moment'
import cars from '/public/users.json'
import EditProductModal from '../components/modals/EditProductModal.vue'
import DeleteProductModal from '../components/modals/DeleteProductModal.vue'
import UserService from '../services/user.service'
import { useUserStore } from '../store/user.store'

const columns = [
  {
    accessorKey: 'id',
    header: 'N',
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
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
      h(EditProductModal, { id: row.original.id }),
      h(DeleteProductModal, { id: row.original.id }),
    ]),
    enableSorting: false,
  },
]

const users = computed(() => {
  return useUserStore().users
})

onMounted(() => {
  UserService.getUsers({})
    .then((res) => {
      useUserStore().clearStore()
      useUserStore().setUsers(res)
    })
})
</script>

<template>
  <div class="container mx-auto">
    <div class="overflow-auto bg-white rounded-3xl shadow">
      <CTable :data="users" :columns="columns" />
    </div>
  </div>
</template>
