<script setup>
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';
import { computed, ref, watch } from 'vue';
import CaretDoubleLeftIcon from '../../assets/icons/CaretDoubleLeftIcon.vue';
import CaretDoubleRightIcon from '../../assets/icons/CaretDoubleRightIcon.vue';
import CaretLeftIcon from '../../assets/icons/CaretLeftIcon.vue';
import CaretRightIcon from '../../assets/icons/CaretRightIcon.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  data: Array,
  columns: Array,
  filter: String,
})

const sorting = ref([])
const data = ref()

watch(() => props.data, (val) => {
  data.value = val
}, {
  immediate: true,
  deep: true
})

const table = useVueTable({
  data: data.value,
  columns: props.columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get sorting() {
      return sorting.value
    },
    get globalFilter() {
      return props.filter
    },
  },
  onSortingChange: updaterOrValue => {
    sorting.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(sorting.value)
        : updaterOrValue
  },
  initialState: {
    pagination: {
      pageSize: 10,
    },
  },
})

const displayedPageNumbers = computed(() => {
  const currentPage = table.getState().pagination.pageIndex + 1
  const pageCount = table.getPageCount()
  const pagesToShow = 2
  let startPage = Math.max(1, currentPage - pagesToShow)
  let endPage = Math.min(pageCount, startPage + 2 * pagesToShow - 1)
  if (endPage - startPage < 2 * pagesToShow - 1) {
    startPage = Math.max(1, endPage - 2 * pagesToShow + 1)
  }
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
})

</script>

<template>
  <div class="flow-root">
    <div class="-mx-2 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table class="min-w-full divide-y divide-gray-300">
          <thead>
            <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
              <th v-for="header in headerGroup.headers" :key="header.id" scope="col"
                class="px-3 py-3.5 text-left text-slate-400 dark:text-white text-base font-medium" :class="{
                  'cursor-pointer select-none': header.column.getCanSort(),
                }" @click="header.column.getToggleSortingHandler()?.($event)">
                <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                {{ { asc: '↑', desc: '↓' }[header.column.getIsSorted()] }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="row in table.getRowModel().rows" :key="row.id">
              <td v-for="cell in row.getVisibleCells()" :key="cell.id"
                class="whitespace-nowrap px-3 py-3 text-neutral-800 dark:text-white text-base font-normal">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="flex items-center justify-between my-6">
      <div class="text-base dark:text-white font-medium">
        {{ $t('total') }}:
        {{ table.getFilteredRowModel().rows.length }}
      </div>
      <div class="flex items-center space-x-2">
        <button :disabled="!table.getCanPreviousPage()" @click="table.setPageIndex(0)"
          class="flex items-center justify-center px-3 py-2 text-base font-medium dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
          <CaretDoubleLeftIcon class="w-5 h-5" />
        </button>
        <button :disabled="!table.getCanPreviousPage()" @click="table.previousPage()"
          class="flex items-center justify-center px-3 py-2 text-base font-medium dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
          <CaretLeftIcon class="w-5 h-5" />
        </button>
        <div class="flex items-center space-x-2">
          <button v-for="pageNumber in displayedPageNumbers" :key="pageNumber"
            @click="table.setPageIndex(pageNumber - 1)" :class="{
              'bg-blue-600 text-white': pageNumber === table.getState().pagination.pageIndex + 1,
              'hover:bg-blue-200': pageNumber !== table.getState().pagination.pageIndex + 1,
            }"
            class="px-3 py-2 select-none rounded-lg dark:text-white text-center text-base font-medium transition-all">
            {{ pageNumber }}
          </button>
        </div>
        <button :disabled="!table.getCanNextPage()" @click="table.nextPage()"
          class="flex items-center gap-2 px-3 py-2 text-base font-medium text-center dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
          <CaretRightIcon class="w-5 h-5" />
        </button>
        <button :disabled="!table.getCanNextPage()" @click="table.setPageIndex(table.getPageCount() - 1)"
          class="flex items-center gap-2 px-3 py-2 text-base font-medium dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
          <CaretDoubleRightIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>