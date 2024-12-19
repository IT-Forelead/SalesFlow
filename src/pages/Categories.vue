<script setup>
import { onMounted, onUnmounted, h, ref, computed } from 'vue';
import CategoryService from '../services/category.service.js';
import { useCategoryStore } from '../store/category.store.js';
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

const CategoryStore = useCategoryStore()


const CategoryTable = computed(() => CategoryStore.categories)
const renderkey = computed(() => CategoryStore.renderkey)

// Контроль размонтирования
let isComponentMounted = true;

onMounted(() => {
  isComponentMounted = true;
  getCategories();
});

onUnmounted(() => {
  isComponentMounted = false;
});

const getCategories = async () => {
  isLoading.value = true;
  try {
    const res = await CategoryService.getCategories();
    if (isComponentMounted) {
      useCategoryStore().clearStore();
      useCategoryStore().setCategories(res);
      useCategoryStore().renderkey += 1
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
    header: 'Nomi',
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
      h('button', { onClick: () => { openEditCategoryModal(row.original) } }, [
        h(EditIcon, { class: 'w-6 h-6 dark:text-blue-400 text-blue-600 hover:scale-105' })
      ]),
      h('button', { onClick: () => { openDeleteCategoryModal(row.original) } }, [
        h(TrashIcon, { class: 'w-6 h-6 dark:text-red-400 text-red-600 hover:scale-105' })
      ]),
    ]),
    enableSorting: false,
  },
];
const openDeleteCategoryModal = (data) => {
  useModalStore().openDeleteCategoryModal()
  useCategoryStore().setSelectedCategory(data)
}

const openEditCategoryModal = (data) => {
  useModalStore().openEditCategoryModal()

  getCategories(data)
}
</script>

<template>
  <div class="p-4 md:p-8">
    <div class="text-slate-900 dark:text-white text-2xl md:text-3xl font-semibold mb-6">
      {{ $t('barcodes') }}
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
        <button @click="useModalStore().openCreateCategoryModal()"
          class="w-full md:w-auto py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          {{ $t('addCategory') }}
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 dark:text-zinc-300 animate-spin" />
    </div>
    <CTable
    :key="renderkey"
      v-else
      :data="CategoryTable"
      :columns="columns"
      :filter="globalSearchFromTable"
    />
  </div>
</template>
