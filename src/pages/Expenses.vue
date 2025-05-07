<script setup>
import { onMounted, onUnmounted, h, ref, computed, reactive } from 'vue';
import ExpenseService from '../services/expense.service.js';
import { useExpenseStore } from '../store/expense.store.js';
import useMoneyFormatter from '../mixins/currencyFormatter'
import { useI18n } from 'vue-i18n';
import moment from 'moment';
import CTable from '../components/common/CTable.vue';
import EditIcon from '@/assets/icons/EditIcon.vue';
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue';
import { onClickOutside } from '@vueuse/core';
import { useModalStore } from '../store/modal.store.js';
import { useDropdownStore } from '../store/dropdown.store.js';

const { t } = useI18n();
const expenseDropdown = ref();
const globalSearchFromTable = ref('');
const isLoading = ref(false);
const expenseStore = useExpenseStore();
const ExpenseTable = computed(() => expenseStore.expenses);
const renderkey = computed(() => expenseStore.renderkey);

let isComponentMounted = true;

onMounted(() => {
  isComponentMounted = true;
  getExpenses({
    limit: 10,
    page: 1,
  });
});

onUnmounted(() => {
  isComponentMounted = false;
});

const getExpenses = async () => {
  isLoading.value = true;
  try {
    const res = await ExpenseService.getExpenses({
      limit: 10,
      page: 1,
    });
    if (isComponentMounted) {
      useExpenseStore().clearStore();
      useExpenseStore().setExpenses(res.data);
      useExpenseStore().renderkey += 1;
    }
  } finally {
    isLoading.value = false;
  }
};

const columns = [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'cursor-default' }, t('n')),
    enableSorting: false,
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
  },
  {
    accessorKey: 'name',
    header: t('name'),
  },
  {
    accessorKey: 'amount',
    accessorFn: row => `${useMoneyFormatter(row.amount)}`,
    header: t('expenseAmount'),
  },
  {
    header: t('expenseType'),
    cell: ({ row }) =>
      h('div', { class: 'flex items-center' }, [
        row.original.expenseType == 'one_time'
          ? h('span', t('oneTime'))
          : [
              row.original.expenseType == 'repeated'
                ? h('span', t('repeated'))
                : `${row.original.expenseType}`,
            ],
      ]),
  },
  {
    accessorKey: 'createdAt',
    accessorFn: (row) => moment(row.createdAt).format('DD/MM/YYYY H:mm'),
    header: t('createdAt'),
  },
  {
    accessorKey: 'actions',
    header: t('actions'),
    cell: ({ row }) => h('div', { class: 'flex items-center space-x-2' }, [
      h('button', { onClick: () => { openEditExpenseModal(row.original) } }, [
        h(EditIcon, { class: 'w-6 h-6 dark:text-blue-400 text-blue-600 hover:scale-105' })
      ]),
    ]),
    enableSorting: false,
  },
];

const openEditExpenseModal = (data) => {
  useExpenseStore().setSelectedExpense(data);
  useModalStore().openEditExpenseModal();
};

// const filterExpenseData = reactive({
//   limit: expenseStore.limit,
//   expenseType: expenseStore.expenseType,
//   from: expenseStore.from,
//   to: expenseStore.to,
//   intervalType: ''
// });

// const cleanFilterExpenseData = () => {
//   filterExpenseData.limit = 0;
//   filterExpenseData.expenseType = '';
//   filterExpenseData.from = '';
//   filterExpenseData.to = '';
//   filterExpenseData.intervalType = '';
// };

// const submitExpensesFilterData = () => {
//   if (!filterExpenseData.intervalType) {
//     toast.warning(t('plsSelectIntervalType'));
//   } else if (!filterExpenseData.limit) {
//     toast.warning(t('plsSelectLimit'));
//   } else {
//     isLoading.value = true;
//     ExpenseService.getExpenses({
//       limit: filterExpenseData.limit,
//       expenseType: filterExpenseData.expenseType,
//       from: filterExpenseData.from,
//       to: filterExpenseData.to,
//       intervalType: filterExpenseData.intervalType
//     })
//       .then((res) => {
//         expenseStore.clearStore();
//         expenseStore.setExpenses(res.data);
//         isLoading.value = false;
//         if (useDropdownStore().isOpenExpenseFilterBy) {
//           useDropdownStore().toggleExpenseFilterBy();
//         }
//       })
//       .catch(() => {
//         isLoading.value = false;
//       });
//   }
// };

// onClickOutside(expenseDropdown, () => {
//   if (useDropdownStore().isOpenExpenseFilterBy) {
//     useDropdownStore().toggleExpenseFilterBy();
//   }
// });
</script>

<template>
  <div class="p-4 md:p-8">
    <div class="text-slate-900 dark:text-white text-2xl md:text-3xl font-semibold mb-6">
      {{ $t('expenses') }}
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

      <div class="w-full flex space-x-10 md:w-auto order-1 md:order-2">
        <!-- <div class="relative" ref="expenseDropdown">
          <div @click="useDropdownStore().toggleExpenseFilterBy()"
            class="border-none w-40 select-none text-gray-900 bg-white dark:text-zinc-200 dark:bg-slate-800 shadow rounded-lg p-2 px-5 flex items-center hover:bg-gray-100 cursor-pointer space-x-1">
            <FunnelIcon class="w-5 h-5 dark:text-zinc-50 text-gray-400" />
            <span>{{ $t('filter') }}</span>
          </div>
          <div v-if="useDropdownStore().isOpenExpenseFilterBy"
            class="absolute dark:bg-slate-800  w-80  bg-white shadow rounded-xl  p-3 z-20 top-12 right-0 space-y-3">
            <div class="flex space-x-4">
              <label for="limit" class="dark:text-white w-1/2">
                {{ $t('limit') }}
                <input v-model="filterExpenseData.limit" type="number" min="0"
                  class="border-none text-gray-500 bg-gray-100 rounded-lg dark:bg-slate-600 dark:text-white w-full" />
              </label>
              <label for="expenseType" class="dark:text-white w-1/2">
                {{ $t('expenseType') }}
                <select v-model="filterExpenseData.expenseType"
                  class="bg-blue-100 dark:bg-slate-600 border-none text-slate-900 dark:text-white rounded-lg text-base md:text-lg block w-full h-11">
                  <option value="">{{ $t('oneTime') }}</option>
                  <option value="repeated">{{ $t('repeated') }}</option>
                </select>
              </label>
            </div>
            <div class="flex space-x-4">
              <label for="from" class="dark:text-white w-1/2">
                {{ $t('from') }}
                <input v-model="filterExpenseData.from" type="date"
                  class="border-none text-gray-500 bg-gray-100 rounded-lg dark:bg-slate-600 dark:text-white w-full" />
              </label>
              <label for="to" class="dark:text-white w-1/2">
                {{ $t('to') }}
                <input v-model="filterExpenseData.to" type="date"
                  class="border-none text-gray-500 bg-gray-100 rounded-lg dark:bg-slate-600 dark:text-white w-full" />
              </label>
            </div>
            <div class="flex justify-between space-x-4">
              <label for="intervalType" class="dark:text-white w-1/2">
                {{ $t('intervalType') }}
                <select v-model="filterExpenseData.intervalType"
                  class="bg-blue-100 dark:bg-slate-600 border-none text-slate-900 dark:text-white rounded-lg text-base md:text-lg block w-full h-11">
                  <option value="day">{{ $t('day') }}</option>
                  <option value="week">{{ $t('week') }}</option>
                  <option value="month">{{ $t('month') }}</option>
                  <option value="year">{{ $t('year') }}</option>
                </select>
              </label>
            </div>
            <div class="flex items-center space-x-2">
              <div @click="cleanFilterExpenseData()"
                class="basis-1/3 w-full bg-slate-100 hover:bg-slate-300 cursor-pointer select-none py-3 rounded-lg flex items-center justify-center">
                <span>{{ $t('cleaning') }}</span>
              </div>
              <div class="basis-2/3">
                <div v-if="isLoading"
                  class="w-full bg-blue-600 py-3 select-none text-white rounded-lg flex items-center justify-center">
                  <Spinners270RingIcon
                    class="mr-2 w-5 h-5 text-gray-200 animate-spin fill-gray-600 dark:fill-gray-300" />
                  <span>{{ $t('loading') }}</span>
                </div>
                <div v-else @click="submitExpensesFilterData()"
                  class="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer select-none py-3 text-white rounded-lg flex items-center justify-center">
                  <span>{{ $t('filter') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div> -->
        <button @click="useModalStore().openCreateExpenseModal()"
          class="w-full md:w-auto py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          {{ $t('createExpense') }}
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 dark:text-zinc-300 animate-spin" />
    </div>
    <CTable :key="renderkey" v-else :data="ExpenseTable" :columns="columns" :filter="globalSearchFromTable" />
  </div>
</template>
