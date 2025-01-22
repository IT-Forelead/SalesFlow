<script setup>
import {  h, ref, computed } from 'vue';
import WhiteListService from '../services/whiteList.service';
import { useWhiteListStore } from '../store/whiteList.store';
import SearchIcon from '../assets/icons/SearchIcon.vue';
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue';
import { useI18n } from 'vue-i18n';
import moment from 'moment';
import CTable from '../components/common/CTable.vue';
import EditIcon from '@/assets/icons/EditIcon.vue';
import TrashIcon from '@/assets/icons/TrashIcon.vue';
import { useModalStore } from '../store/modal.store'

const { t } = useI18n();
const globalSearchFromTable = ref('');
const isLoading = ref(false);
const WhiteListStore = useWhiteListStore()
const WhiteListTable = computed(() => WhiteListStore.whiteList)
const renderkey = computed(() => WhiteListStore.renderkey)
const page = ref(1)
const pageSize = 30

const getWhiteList = () => {
  isLoading.value = true
  WhiteListService.getWhiteList(pageSize, page.value)
    .then((res) => {
      useWhiteListStore().clearStore()
      useWhiteListStore().setSelectedWhiteList(res.data)
    }).finally(() => {
      isLoading.value = false
    })
  }
getWhiteList()

const columns = [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'cursor-default' }, t('n')),
    enableSorting: false,
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
  },
  {
    accessorKey: 'isActive',
    header: 'isActive',
  },
  {
    accessorKey: 'createdAt',
    accessorFn: row => moment(row.createdAt).format('DD/MM/YYYY H:mm'),
    header: t('createdAt'),
  },
  
  // {
  //   accessorKey: 'actions',
  //   header: t('actions'),
    // cell: ({ row }) => h('div', { class: 'flex items-center space-x-2' }, [
    //   // h('button', { onClick: () => { openEditWhiteListModal(row.original) } }, [
    //   //   h(EditIcon, { class: 'w-6 h-6 dark:text-blue-400 text-blue-600 hover:scale-105' })
    //   // ]),
    //   // h('button', { onClick: () => { openDeleteWhiteListModal(row.original) } }, [
    //   //   h(TrashIcon, { class: 'w-6 h-6 dark:text-red-400 text-red-600 hover:scale-105' })
    //   // ]),
    // ]),
    // enableSorting: false,
  // },
];
// const openDeleteWhiteListModal = (data) => {
//   useModalStore().openDeleteWhiteListModal()
//   useWhiteListStore().setSelectedWhiteList(data)
// }

// const openEditWhiteListModal = (data) => {
//   useWhiteListStore().setSelectedWhiteList(data)
//   useModalStore().openEditWhiteListModal()
//   getWhiteList(data)
// }
</script>

<template>
  <div class="p-4 md:p-8">
    <div class="text-slate-900 dark:text-white text-2xl md:text-3xl font-semibold mb-6">
      {{ $t('WhiteLists') }}
    </div>
    <div class="flex flex-col md:flex-row items-center justify-between">
      <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400 dark:text-white" />
        </div>
        <input
          type="search"
          v-model="globalSearchFromTable"
          class="bg-slate-100 border-none w-full dark:bg-slate-700 dark:text-white text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
          placeholder="Search everything..."
        />
      </div>
      <div class="w-full md:w-auto order-1 md:order-2">
        <button @click="useModalStore().openCreateWhiteListModal()"
          class="w-full md:w-auto py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          {{ $t('addWhiteList') }}
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 dark:text-zinc-300 animate-spin" />
    </div>
    <CTable
    :key="renderkey"
      v-else
      :data="WhiteListTable"
      :columns="columns"
      :filter="globalSearchFromTable"
    />
  </div>
</template>
