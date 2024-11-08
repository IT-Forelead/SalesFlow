<script setup>
import { ref } from 'vue'
import { computed, h } from 'vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import CTable from '../components/common/CTable.vue'
import { useModalStore } from '../store/modal.store.js'
import { useI18n } from 'vue-i18n'
import { usePriceStore } from '../store/price.store.js'
import PriceService from '../services/price.service.js'
import Image from 'primevue/image';
import moment from 'moment'

const { t } = useI18n()

const priceStore = usePriceStore()
const globalSearchFromTable = ref('')
const isLoading = ref(false)

const priceLists = computed(() => priceStore.prices)
const renderkey = computed(() => priceStore.renderkey)


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
    accessorKey: 'company',
    header: t('company'),
  },
  {
    accessorKey: 'description',
    header: t('description')
  },
  {
    accessorKey: 'createdAt',
    accessorFn: row => moment(row.createdAt).format('DD/MM/YYYY H:mm'),
    header: t('createdAt'),
  },
]

const page = ref(1)
const pageSize = 50

const getPrices = async () => {
  isLoading.value = true
  try {
    const res = await PriceService.getPrices({ limit: pageSize, page: page.value })
    const sortedPrices = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    usePriceStore().clearStore()
    usePriceStore().setPrices(sortedPrices)
    usePriceStore().renderkey += 1
  } finally {
    isLoading.value = false
  }
}
getPrices()

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
      {{ $t('priceLists') }}
    </div>

    <div class="flex flex-col md:flex-row items-center justify-between">
      <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400 dark:text-white" />
        </div>
        <input type="search" v-model="globalSearchFromTable"
          class="bg-slate-100 border-none w-full dark:bg-slate-700 dark:text-white text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
          :placeholder="$t('search')">
      </div>
      <div class="w-full md:w-auto order-1 md:order-2">
        <button @click="useModalStore().openCreatePriceModal()"
          class="w-full md:w-auto py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          {{ $t('createPrice') }}
        </button>
      </div>
    </div>
    <div v-if="isLoading && !useModalStore().isOpenImageModal" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 animate-spin" />
    </div>
    <CTable v-else :data="priceLists" :key="renderkey" :columns="columns" :filter="globalSearchFromTable" />
  </div>
</template>
