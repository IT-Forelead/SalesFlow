<script setup>
import { h, ref, computed } from 'vue';
import SessionService from '../services/session.service.js';
import { useSessionStore } from '../store/session.store.js';
import SearchIcon from '../assets/icons/SearchIcon.vue';
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue';
import { useI18n } from 'vue-i18n';
import CTable from '../components/common/CTable.vue';
import moment from 'moment'

const { t } = useI18n();
const globalSearchFromTable = ref('');
const selectedDate = ref(moment().format('YYYY-MM-DD')); // Default to today
const isLoading = ref(false);
const SessionStore = useSessionStore()
const SessionTable = computed(() => SessionStore.sessions)
const renderkey = computed(() => SessionStore.renderkey)
const total = ref(0)
const columns = [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'cursor-default' }, t('n')),
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: t('name'),
  },
  {
    accessorKey: 'ipAddress',
    header: t('ipAddress'),
  },
  {
    accessorKey: 'loginTime',
    accessorFn: row => moment(row.loginTime).format('DD/MM/YYYY H:mm'),
    header: t('loginTime'),
  },
  {
    accessorKey: 'lastActionTime',
    accessorFn: row => moment(row.lastActionTime).format('DD/MM/YYYY H:mm'),
    header: t('lastActionTime'),
  },
  {
    header: t('lastAction'),
    cell: ({ row }) =>
      h('div', { class: 'flex items-center' },
        [
          row.original.lastAction === 'refresh' ?
            h('span', t('refresh')) :
            row.original.lastAction === 'login' ?
              h('span', t('login')) :
              row.original.lastAction === 'logout' ?
                h('span', t('logout')) :
                `${row.original.lastAction}`
        ]
      )
  },
]

const getAllSessions = () => {
  isLoading.value = true
  SessionService.getAllSessions({ limit: 10, page: 1, date: selectedDate.value })
    .then((res) => {
      total.value = res.total
      useSessionStore().clearStore()
      useSessionStore().setSessions(res.data)
    }).finally(() => {
      isLoading.value = false
    })
}
getAllSessions()

</script>

<template>
  <div class="p-4 md:p-8">
    <div class="text-slate-900 dark:text-white text-2xl md:text-3xl font-semibold mb-6">
      {{ $t('sessions') }}
    </div>
    <div class="flex flex-col md:flex-row items-center justify-between">
      <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400 dark:text-white" />
        </div>
        <input type="search" v-model="globalSearchFromTable"
          class="bg-slate-100 border-none w-full dark:bg-slate-700 dark:text-white text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
          placeholder="Search everything..." />
      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 dark:text-zinc-300 animate-spin" />
    </div>
    <CTable :key="renderkey" v-else :data="SessionTable" :columns="columns" :filter="globalSearchFromTable" />
  </div>
</template>
