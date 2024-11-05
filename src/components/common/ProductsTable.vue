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
      pageSize: 50,
    },
  },
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
  </div>
</template>