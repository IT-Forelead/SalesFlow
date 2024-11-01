<script setup>
import { ref, reactive } from 'vue'
import moment from 'moment'
import { computed, h, watch } from 'vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import CTable from '../components/common/CTable.vue'
import { useModalStore } from '../store/modal.store.js'
import { useI18n } from 'vue-i18n'
import { useWishStore } from '../store/wish.store.js'
import WishService from '../services/wish.service.js'
import { useDropdownStore } from '../store/dropdown.store'
import FunnelIcon from '../assets/icons/FunnelIcon.vue'
import BroomIcon from '../assets/icons/BroomIcon.vue'
import { cleanObjectEmptyFields } from '../mixins/utils'
import Image from 'primevue/image'

const { t } = useI18n()
const wishStore = useWishStore()
const globalSearchFromTable = ref('')
const isLoading = ref(false)
const page = ref(1)
const pageSize = 50
const filterByDropdown = ref(null)
const wishes = computed(() => wishStore.wishes)
const renderkey = computed(() => wishStore.renderkey)

const columns = [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'cursor-default'}, t('n')),
    enableSorting: false,
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
  },
  {
    accessorKey: 'asset',
    header: t('image'),
    enableSorting: false,
    cell: ({ row }) =>
      h('div', { class: 'w-12 h-12 flex items-center overflow-hidden border border-gray-300' },
        [row.original.asset ?
          h(Image, { src: `${row.original.asset.url}`, alt: '#', preview: '' }) : h('span')]),
  },
  {
    accessorFn: row => `${row.name}`,
    header: t('name'),
  },
  {
    accessorFn: row => `${row.completed ? t('completed') : t('notCompleted')}`,
    header: t('status'),
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
      h('div', {
        onClick: () => {
          row.original.completed = !row.original.completed;
      updateWish(row.original.id, row.original.completed);
        },
      }, [
      h('input', {
      type: 'checkbox',
      class: 'w-6 h-6 text-blue-600 dark:bg-blue-300 hover:scale-105',
      checked: row.original.completed,
    }),
      ]),
    ]),
    enableSorting: false,
  },
];

const getWishes = async (filters = {}) => {
  isLoading.value = true
  await WishService.getWishes(
    cleanObjectEmptyFields({ limit: pageSize, page: page.value, ...filters }),
  ).then((res) => {
    useWishStore().clearStore()
    useWishStore().setWishes(res.data)
    useWishStore().renderkey += 1
  }).finally(() => isLoading.value = false)
}

getWishes()

const updateWish = (id, boolean) => {
    isLoading.value = true
    WishService.updateWish({
      id: id,
      completed: boolean ,
    }).then(() => {
      isLoading.value = false
      getWishes()
    })}

const submitFilterData = async () => {
  isLoading.value = true
  if (!filterData.from && !filterData.to) {
    toast.error('Kamida bitta vaqtni tanlang')
  } else {
    await getWishes(filterData)
    useDropdownStore().toggleFilterBy()
  }
}

const filterData = reactive({
  createdAt: '',
  from: '',
  to: '',
})

const clearFilterData = () => {
  filterData.createdAt = ''
  filterData.from = ''
  filterData.to = ''
}
</script>
<style>
/* .p-image-mask {
    --maskbg: rgba(0, 0, 0, 0.6);
} */

.p-image-action.p-link {
  color: #ffffff;
}

</style>

<template>
  <div class="p-4 md:p-8">
    <div class="text-slate-900 dark:text-white text-2xl md:text-3xl font-semibold mb-6">
      {{ $t('wishes') }}
    </div>
    <div class="flex flex-col space-x-10 md:flex-row items-center">
      <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400 dark:text-white" />
        </div>
        <input type="search" v-model="globalSearchFromTable"
          class="bg-slate-100 border-none w-full dark:bg-slate-700 dark:text-white text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
          :placeholder="$t('search')">
      </div>

      <div class="w-full flex space-x-20 md:w-auto order-1 md:order-2">
        <div class="relative w-auto" ref="filterByDropdown">
          <div @click="useDropdownStore().toggleFilterBy()"
            class="border-none select-none text-gray-500 bg-slate-100 rounded-full w-full p-2 px-5 flex items-center hover:bg-gray-200 cursor-pointer space-x-1">
            <FunnelIcon class="w-5 h-5 text-gray-400" />
            <span>{{ $t('filter') }}</span>
          </div>
          <div v-if="useDropdownStore().isOpenFilterBy"
            class="absolute bg-white dark:bg-slate-800 shadow-md rounded-xl w-64 p-3 z-20 top-12 right-0 space-y-3">
            <div class="flex-1 space-y-1">
              <label for="from" class="text-base dark:text-white md:text-lg font-medium">
                {{ $t('from') }}
              </label>
              <input id="from" type="date" v-model="filterData.from"
                class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
                :placeholder="t('enterProductQuantity')">
            </div>
            <div class="flex-1 space-y-1">
              <label for="to" class="text-base dark:text-white md:text-lg font-medium">
                {{ $t('to') }}
              </label>
              <input id="to" type="date" v-model="filterData.to"
                class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
                :placeholder="t('enterProductQuantity')">
            </div>
            <div class="flex items-center space-x-2">
              <div @click="clearFilterData()"
                class="bg-blue-500 hover:bg-blue-600 cursor-pointer select-none py-2 px-3 text-white rounded-lg flex items-center justify-center">
                <BroomIcon class="w-5 h-5 text-white" />
              </div>
              <div v-if="isLoading"
                class="w-full bg-blue-600 py-2 select-none text-white rounded-lg flex items-center justify-center">
                <Spinners270RingIcon
                  class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-white fill-gray-600 dark:fill-gray-300" />
                <span>{{ $t('loading') }}</span>
              </div>
              <div v-else @click="submitFilterData()"
                class="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer select-none py-2 text-white rounded-lg flex items-center justify-center">
                <span>{{ $t('filter') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 dark:text-zinc-300 animate-spin" />
    </div>
    <CTable :key="renderkey" v-else :data="wishes" :columns="columns" :filter="globalSearchFromTable" />
  </div>
</template>