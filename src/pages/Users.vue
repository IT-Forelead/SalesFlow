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
const renderkey = ref(0)
const users = computed(() => {
  renderkey.value += 1
  return userStore.users
})

const privileges = computed(() => {
  return userStore.privileges
})

const getRole = (privileges) => {
  switch (true) {
    case
    privileges.includes('create_user') &&
    privileges.includes('update_user') &&
    privileges.includes('view_users') &&
    privileges.includes('view_products') &&
    privileges.includes('view_histories') &&
    privileges.includes('find_barcode') &&
    privileges.includes('find_order') &&
    privileges.includes('view_orders') &&
    privileges.includes('create_market') &&
    privileges.includes('view_markets') &&
    privileges.includes('dashboard'):
      return 'Admin'
    case
    privileges.includes('create_user') &&
    privileges.includes('view_users') &&
    privileges.includes('update_user') &&
    privileges.includes('dashboard') &&
    privileges.includes('view_products') &&
    privileges.includes('view_histories') &&
    privileges.includes('find_barcode') &&
    privileges.includes('find_order'):
      return 'Boshqaruvchi'
    case
    privileges.includes('create_user') &&
    privileges.includes('view_users') &&
    privileges.includes('update_user') &&
    privileges.includes('view_products') &&
    privileges.includes('view_histories') &&
    privileges.includes('find_barcode') &&
    privileges.includes('find_order') &&
    privileges.includes('dashboard'):
      return 'Kassir'
    default:
      return 'Foydalanuvchi'
  }
}

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
    accessorKey: 'privileges',
    header: 'Role',
    accessorFn: row => getRole(row.privileges),
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
        <button @click="useModalStore().openCreateUserModal()"
                class="w-full py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          Foydalanuvchi qo'shish
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 animate-spin" />
    </div>
    <CTable :key="renderkey" v-else :data="users" :columns="columns" :filter="globalSearchFromTable" />
  </div>
</template>
