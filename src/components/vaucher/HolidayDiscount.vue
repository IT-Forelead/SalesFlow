<script setup>
import { useModalStore } from '../../store/modal.store.js'
import CTable from '../common/CTable.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import SearchIcon from '../../assets/icons/SearchIcon.vue'
import { computed, h, ref } from 'vue'
import { useHolidayDiscount } from '../../store/holidayDiscount.store.js'
import HolidayDiscountService from '../../services/holidayDiscount.service.js'
import { useI18n } from 'vue-i18n'
import TrashIcon from '../../assets/icons/TrashIcon.vue'

const { t } = useI18n()
const isLoading = ref(false)
const globalSearchFromTable = ref('')
const renderKey = ref(0)

const holidayDiscountStore = useHolidayDiscount()
const holidayDiscounts = computed(() => {
  renderKey.value += 1
  return holidayDiscountStore.holidayDiscounts
})

const columns = [
  {
    accessorKey: 'id',
    header: t('n'),
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
    enableSorting: false,
  },
  { accessorKey: 'quantity', header: t('quantity') },
  {
    header: t('percentage'),
    cell: ({ row }) => `${row.original.percentage} %`,
  },
  { accessorKey: 'from', header: t('from') },
  { accessorKey: 'to', header: t('to') },
  {
    accessorKey: 'used',
    header: t('used'),
  },
  {
    accessorKey: 'actions',
    header: t('actions'),
    cell: ({ row }) => h('div', { class: 'flex items-center space-x-2' }, [
      h('button', {
        onClick: () => {
          openDeleteHolidayDiscountModal(row.original)
        },
      }, [
        h(TrashIcon, { class: 'w-6 h-6 text-red-600 hover:scale-105' }),
      ]),
    ]),
    enableSorting: false,
  },
]

const openDeleteHolidayDiscountModal = (data) => {
  useModalStore().openDeleteHolidayDiscountModal()
  useHolidayDiscount().setSelectedHolidayDiscount(data)
}

const getHolidayDiscounts = () => {
  isLoading.value = true
  HolidayDiscountService.getHolidayDiscounts()
    .then((res) => {
      useHolidayDiscount().clearStore()
      useHolidayDiscount().setHolidayDiscounts(res)
    }).finally(() => {
    isLoading.value = false
  })
}
getHolidayDiscounts()
</script>

<template>
  <div class="text-slate-900 text-2xl md:text-3xl font-semibold mb-6">
    {{ $t('holidayDiscounts') }}
  </div>
  <div class="flex flex-col md:flex-row items-center justify-between">
    <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon class="w-5 h-5 text-slate-400" />
      </div>
      <input type="search" v-model="globalSearchFromTable"
             class="bg-slate-100 border-none w-full text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
             placeholder="Search everything...">
    </div>
    <div class="w-full md:w-auto order-1 md:order-2">
      <button @click="useModalStore().openCreateHolidayDiscountModal()" class="w-full md:w-auto py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
        {{ $t('addHolidayDiscount') }}
      </button>
    </div>
  </div>
  <div v-if="isLoading" class="flex items-center justify-center h-20">
    <Spinners270RingIcon class="w-6 h-6 text-gray-500 animate-spin" />
  </div>
  <CTable v-else :data="holidayDiscounts" :key="renderKey" :columns="columns" :filter="globalSearchFromTable" />
</template>

<style scoped>

</style>