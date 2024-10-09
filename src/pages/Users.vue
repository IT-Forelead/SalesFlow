<script setup>
import PhPencilIcon from '../assets/icons/EditIcon.vue'
import PhTrash from '../assets/icons/TrashIcon.vue'
import { ref } from 'vue'
import moment from 'moment'
import { computed, h } from 'vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import CTable from '../components/common/CTable.vue'
import UserService from '../services/user.service'
import { useUserStore } from '../store/user.store.js'
import { useModalStore } from '../store/modal.store.js'
import { useI18n } from 'vue-i18n'
import AgentService from '@/services/agent.service.js'
import { useAgentStore } from '@/store/agent.store.js'

const { t } = useI18n()

const userStore = useUserStore()
const globalSearchFromTable = ref('')
const isLoading = ref(false)

const users = computed(() => userStore.users)
const renderkey = computed(() => userStore.renderkey)

const getRole = (privileges) => {
  switch (true) {
    case
      privileges.includes('create_barcode') &&
      privileges.includes('create_market') &&
      privileges.includes('create_user') &&
      privileges.includes('dashboard') &&
      privileges.includes('update_barcode') &&
      privileges.includes('view_barcodes') &&
      privileges.includes('view_histories') &&
      privileges.includes('view_markets') &&
      privileges.includes('view_orders') &&
      privileges.includes('view_products') &&
      privileges.includes('view_users'):
      return t('admin')
    case
      privileges.includes('create_agent') &&
      privileges.includes('create_history') &&
      privileges.includes('create_order') &&
      privileges.includes('create_product') &&
      privileges.includes('delete_product') &&
      privileges.includes('create_user') &&
      privileges.includes('dashboard') &&
      privileges.includes('find_barcode') &&
      privileges.includes('find_order') &&
      privileges.includes('update_agent') &&
      privileges.includes('update_product') &&
      privileges.includes('update_settings') &&
      privileges.includes('view_agents') &&
      privileges.includes('view_histories') &&
      privileges.includes('view_markets') &&
      privileges.includes('view_orders') &&
      privileges.includes('view_products') &&
      privileges.includes('view_settings') &&
      privileges.includes('view_users'):
      return t('manager')
    case
      privileges.includes('create_history') &&
      privileges.includes('create_order') &&
      privileges.includes('create_product') &&
      privileges.includes('dashboard') &&
      privileges.includes('find_barcode') &&
      privileges.includes('find_order') &&
      privileges.includes('update_product') &&
      privileges.includes('update_settings') &&
      privileges.includes('view_agents') &&
      privileges.includes('view_orders') &&
      privileges.includes('view_products')&&
      privileges.includes('view_users'):
      return t('cashier')
    default:
      return t('user')
  }
}

const columns = [
  {
    accessorKey: 'id',
    header: t('n'),
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
  },
  {
    accessorKey: 'login',
    header: t('login'),
  },
  {
    accessorFn: row => `${row.firstname} ${row.lastname}`,
    header: t('user'),
  },
  {
    accessorKey: 'phone',
    header: t('phoneNumber'),
  },
  {
    accessorKey: 'privileges',
    header: t('role'),
    accessorFn: row => getRole(row.privileges),
  },
  {
    accessorKey: 'marketName',
    header: t('shop'),
    accessorFn: row => row.marketName
  },
  {
    accessorKey: 'createdAt',
    accessorFn: row => moment(row.createdAt).format('DD/MM/YYYY H:mm'),
    header: t('createdAt'),
  },
  {
    accessorKey: 'actions',
    header: t('actions'),
    cell: ({ row }) => h('div', { class: 'flex items-center space-x-2' }, [
      h('button', { onClick: () => { openEditUser(row.original) } }, [
        h(PhPencilIcon, { class: 'w-6 h-6 text-blue-600 hover:scale-105' })
      ]),
      // h('button', { onClick: () => { openDeleteUserModal(row.original) } }, [
      //   h(PhTrash, { class: 'w-6 h-6 text-red-600 hover:scale-105' })
      // ]),
    ]),
    enableSorting: false,
  },
]

const openEditUser = (data) => {
  useUserStore().setSelectedUser(data)
  useModalStore().openEditUserModal()
}

const openDeleteUserModal = (data) => {
  useModalStore().openDeleteUserModal()
  useUserStore().setSelectedUser(data)
}

const getUsers = async () => {
  isLoading.value = true
  try {
    const res = await UserService.getUsers()
    useUserStore().clearStore()
    useUserStore().setUsers(res)
    useUserStore().renderkey += 1
  } finally {
    isLoading.value = false
  }
}

getUsers()

</script>

<template>
  <div class="p-4 md:p-8">
    <div class="dark:text-white text-2xl md:text-3xl font-semibold mb-6">
      {{ $t('users') }}
    </div>
    <div class="flex flex-col md:flex-row items-center justify-between">
      <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 dark:text-white" />
        </div>
        <input type="search" v-model="globalSearchFromTable"
          class="bg-slate-100 border-none w-full dark:text-white text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
          :placeholder="$t('search')">
      </div>
      <div class="w-full md:w-auto order-1 md:order-2">
        <button @click="useModalStore().openCreateUserModal()"
          class="w-full md:w-auto py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          {{ $t('addUser') }}
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 animate-spin" />
    </div>
    <CTable :key="renderkey" v-else :data="users" :columns="columns" :filter="globalSearchFromTable" />
  </div>
</template>
