<script setup>
import { ref } from 'vue'
import moment from 'moment'
import { computed, h } from 'vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import CTable from '../components/common/CTable.vue'
import UserService from '../services/user.service'
import EditUserModal from '../components/modals/EditUserModal.vue'
import DeleteUserModal from '../components/modals/DeleteUserModal.vue'
import { useUserStore } from '../store/user.store.js'
import { useModalStore } from '../store/modal.store.js'

const globalSearchFromTable = ref('')
const isLoading = ref(false)

const userStore = useUserStore()
const users = computed(() => {
  return userStore.users
})

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
    accessorFn: row => row?.privileges.join(', '),
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
      h(EditUserModal, { id: row.original.id }),
      h(DeleteUserModal, { id: row.original.id }),
    ]),
    enableSorting: false,
  },
]

const getUsers = () => {
  isLoading.value = true
  UserService.getUsers({})
    .then((res) => {
      useUserStore().clearStore()
      useUserStore().setUsers(res)
    }).finally(() => {
    isLoading.value = false
  })
}


getUsers()

</script>

<template>
  <div class="p-8">
    <div class="text-slate-900 text-2xl md:text-3xl font-semibold mb-6">
      Foydalanuvchilar
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
        <button @click="useModalStore().openCreateUserModal()" class="w-full py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          Foydalanuvchi qo'shish
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 animate-spin" />
    </div>
    <CTable v-else :data="users" :columns="columns" :filter="globalSearchFromTable" />
  </div>
</template>
