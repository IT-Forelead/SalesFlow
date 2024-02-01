<script setup>
import { computed, h, ref } from 'vue'
import CTable from '../components/common/CTable.vue'
import moment from 'moment'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import EditIcon from '../assets/icons/EditIcon.vue'
import TrashIcon from '../assets/icons/TrashIcon.vue'
import MarketService from '../services/market.service'
import { useModalStore } from '../store/modal.store'
import { useMarketStore } from '../store/market.store'

const globalSearchFromTable = ref('')
const renderKey = ref(0)
const marketStore = useMarketStore()
const markets = computed(() => {
  renderKey.value += 1
  return marketStore.markets
})
const isLoading = ref(false)

const columns = [
  {
    accessorKey: 'id',
    header: 'N',
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: "Do'kon nomi",
  },
  {
    accessorKey: 'address',
    header: 'Manzili',
  },
  {
    accessorKey: 'createdAt',
    accessorFn: row => moment(row.createdAt).format('DD/MM/YYYY H:mm'),
    header: 'Yaratilgan vaqti',
  },
  {
    accessorKey: 'actions',
    header: 'Amallar',
    cell: ({ row }) => h('div', { class: 'flex items-center space-x-2' }, [
      h('button', { onClick: () => { openEditMarketModal(row.original) } }, [
        h(EditIcon, { class: 'w-6 h-6 text-blue-600 hover:scale-105' })
      ]),
      h('button', { onClick: () => { openDeleteMarketModal(row.original) } }, [
        h(TrashIcon, { class: 'w-6 h-6 text-red-600 hover:scale-105' })
      ]),
    ]),
    enableSorting: false,
  },
]

const openEditMarketModal = (data) => {
  useModalStore().openEditMarketModal()
  useMarketStore().setSelectedMarket(data)
}

const openDeleteMarketModal = (data) => {
  useModalStore().openDeleteMarketModal()
  useMarketStore().setSelectedMarket(data)
}

const getMarkets = () => {
  isLoading.value = true
  MarketService.getMarkets()
    .then((res) => {
      useMarketStore().clearStore()
      useMarketStore().setMarkets(res)
    }).finally(() => {
      isLoading.value = false
    })
}

getMarkets()
</script>

<template>
  <div class="p-8">
    <div class="text-slate-900 text-2xl md:text-3xl font-semibold mb-6">
      Do'konlar
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
        <button @click="useModalStore().openCreateMarketModal()"
          class="w-full py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          Do'kon qo'shish
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 animate-spin" />
    </div>
    <CTable v-else :data="markets" :key="renderKey" :columns="columns" :filter="globalSearchFromTable" />
  </div>
</template>
