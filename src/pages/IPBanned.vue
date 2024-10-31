<script setup>
import PhLockKeyOpen from '../assets/icons/LockKeyOpenIcon.vue'
import { ref } from 'vue'
import moment from 'moment'
import { computed, h } from 'vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import CTable from '../components/common/CTable.vue'
import { useModalStore } from '../store/modal.store.js'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../store/auth.store.js'
import IPBanService from '../services/auth.service.js'

const { t } = useI18n()

const authStore = useAuthStore()
const globalSearchFromTable = ref('')
const isLoading = ref(false)

const ipBans = computed(() => authStore.ipBans)
const renderkey = computed(() => authStore.renderkey)


const columns = [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'cursor-default'}, t('n')),
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
    enableSorting: false,
  },
  {
    accessorFn: row => `${row}`,
    header: t('ipAddress'),
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
      h('button', { onClick: () => { openDeleteIPBanModal(row.original) } }, [
        h(PhLockKeyOpen, { class: 'w-6 h-6 text-green-600 dark:text-green-400 text-green-600 hover:scale-105' })
      ]),
    ]),
    enableSorting: false,
  },
]


const openDeleteIPBanModal = (data) => {
  useModalStore().openDeleteIPBanModal()
  useAuthStore().setSelectedIPBan(data)
}

const getIPBans = async () => {
  isLoading.value = true
  try {
    const res = await IPBanService.getIPBans()
    useAuthStore().clearStore()
    useAuthStore().setIPBans(res)
    useAuthStore().renderkey += 1
  } finally {
    isLoading.value = false
  }
}
getIPBans()

</script>

<template>
  <div class="p-4 md:p-8">
    <div class="text-slate-900 dark:text-white text-2xl md:text-3xl font-semibold mb-6">
      {{ $t('ipBanned') }}
    </div>
    <div class="flex flex-col md:flex-row items-center justify-between">
      <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400" />
        </div>
        <input type="search" v-model="globalSearchFromTable"
          class="bg-slate-100 border-none w-full text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
          :placeholder="$t('search')">
      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 dark:text-zinc-300 animate-spin" />
    </div>
    <CTable :key="renderkey" v-else :data="ipBans" :columns="columns" :filter="globalSearchFromTable" />
  </div>
</template>
