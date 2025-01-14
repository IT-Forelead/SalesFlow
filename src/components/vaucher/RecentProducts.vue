<script setup>
import { computed, h, ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProductStore } from '../../store/product.store.js'
import { useModalStore } from '../../store/modal.store.js'
import ProductService from '../../services/product.service.js'
import { useDropdownStore } from '../../store/dropdown.store'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import SearchIcon from '../../assets/icons/SearchIcon.vue'
import FunnelIcon from '../../assets/icons/FunnelIcon.vue'
import EyeSlashIcon from '../../assets/icons/EyeSlashIcon.vue'
import { onClickOutside } from '@vueuse/core'
import CTable from '../common/CTable.vue'

const { t } = useI18n()
const isLoading = ref(false)
const globalSearchFromTable = ref('')
const productStore = useProductStore()
const productStats = ref()

const recentProducts = computed(() => productStore.recentProducts)
const renderKey = computed(() => productStore.renderKey)

const columns = [
  {
    accessorKey: 'id',
    header: t('n'),
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
    enableSorting: false,
  },
  {
    accessorKey: 'serialId',
    header: t('serialId'),
  },
  {
    accessorKey: 'productId',
    header: t('productId')
  },
  {
    accessorKey: 'name',
    header: t('name'),
  },
  {
    accessorKey: 'packaging',
    header: t('packaging')
  },
  {
    accessorKey: 'barcode',
    header: t('bardcode')
  },
  {
    accessorKey: 'saleType',
    header: t('saleType'),
  },
  {
    accessorKey: 'remaining',
    header: t('remaining')
  },
  {
    accessorKey: 'sold',
    header: t('sold')
  },
  {
    accessorKey: 'actions',
    header: t('actions'),
    cell: ({ row }) => h('div', { class: 'flex items-center space-x-2' }, [
      h('button', {
        onClick: () => {
          openDeleteRecentProductModal(row.original)
        },
      }, [
        h(EyeSlashIcon, { class: 'w-6 h-6 text-red-600 hover:scale-105' }),
      ]),
    ]),
    enableSorting: false,
  },
]

const openDeleteRecentProductModal = (data) => {
  useModalStore().openDeleteRecentProductModal()
  productStore.setSelectedProduct(data)
}

const openHiddenRecentProductsModal = () => {
  ProductService.getRecentlyProducts(1, 30).then((res) => {
      productStore.clearStore()
      productStore.setHiddenRecentProducts(res.data)
      useModalStore().openHiddenRecentProductsModal()
    })
}

const filterRecentData = reactive({
  intervalType: productStore.intervalType,
  limit: productStore.limit,
})

const cleanFilterRecentData = () => {
  filterRecentData.intervalType = ""
  filterRecentData.limit = 0
}

const submitRecentStatsFilterData = () => {
  if (!filterRecentData.intervalType || !filterRecentData.limit) {
    toast.warning(t('Пожалуйста, заполните все поля фильтра.'));
    return;
  }
  isLoading.value = true;
  ProductService.getRecentlyOutProducts({
    intervalType: filterRecentData.intervalType,
    limit: filterRecentData.limit,
  })
    .then((res) => {
      productStore.setRecentProducts(res.data);
    })
    .catch((err) => {
      console.error('Ошибка при загрузке данных:', err);
    })
    .finally(() => {
      isLoading.value = false;
    });
};


const getRecentlyOutProducts = () => {
  isLoading.value = true;
  ProductService.getRecentlyOutProducts({
    intervalType: filterRecentData.intervalType,
    limit: filterRecentData.limit,
  })
  .then((res) => {
      productStore.clearStore()
      productStore.setRecentProducts(res)
    }).finally(() => {
      isLoading.value = false
    })
}

onMounted(() => {
  console.log('Вызов getRecentlyOutProducts');
  cleanFilterRecentData
  getRecentlyOutProducts()
  ProductService.getProductStats()
  .then((res) => {
      productStats.value = res
    })
})

const recentDropdown = ref()

onClickOutside(recentDropdown, () => {
  if (useDropdownStore().isOpenRecentFilterBy) {
    useDropdownStore().toggleRecentFilterBy()
  }
})
</script>

<template>
  <div class="text-slate-900 text-2xl md:text-3xl font-semibold mb-6">
    {{ $t('recentProducts') }}
  </div>

  <!-- Search and Filter Section -->
  <div class="flex flex-col md:flex-row items-center justify-between">
    <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon class="w-5 h-5 text-slate-400 dark:text-white" />
      </div>
      <input type="search" v-model="globalSearchFromTable"
        class="dark:bg-slate-800 dark:text-white bg-slate-100 border-none w-full text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
        placeholder="Search everything...">
    </div>

    <!-- Filter Dropdown Section -->
    <div class="flex justify-between space-x-10 w-full md:w-auto order-1 md:order-2">
      <div class="relative" ref="recentDropdown">
        <div @click="useDropdownStore().toggleRecentFilterBy()"
          class="border-none w-40 select-none text-gray-900 bg-white dark:text-zinc-200 dark:bg-slate-800 shadow rounded-lg p-2 px-5 flex items-center hover:bg-gray-100 cursor-pointer space-x-1">
          <FunnelIcon class="w-5 h-5 dark:text-zinc-50 text-gray-400" />
          <span>{{ $t('filter') }}</span>
        </div>
        <div v-if="useDropdownStore().isOpenRecentFilterBy"
          class="absolute dark:bg-slate-800  w-80  bg-white shadow rounded-xl  p-3 z-20 top-12 right-0 space-y-3">
          <div class=" items-center space-x-1">
            <div class="flex">
            </div>
            <div class="flex justify-between space-x-4"><label for="" class="dark:text-white w-1/2">
                {{ $t('limit') }}
                <input v-model="filterRecentData.limit" type="number" min="0"
                  class="border-none text-gray-500 bg-gray-100 rounded-lg     dark:bg-slate-600 dark:text-white w-full" />
              </label>
              <label for="" class="dark:text-white w-1/2">
                {{ $t('intervalType') }}
                <select v-model="filterRecentData.intervalType"
                  class="bg-blue-100 dark:bg-slate-600 border-none text-slate-900 dark:text-white rounded-lg text-base md:text-lg block w-full h-11">
                  <option value="day">
                    {{ $t('day') }}
                  </option>
                  <option value="week">
                    {{ $t('week') }}
                  </option>
                  <option value="month">
                    {{ $t('month') }}
                  </option>
                  <option value="year">
                    {{ $t('year') }}
                  </option>
                </select>
              </label>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <div @click="cleanFilterRecentData()"
              class="basis-1/3 w-full bg-slate-100 hover:bg-slate-300 cursor-pointer select-none py-3 rounded-lg flex items-center justify-center">
              <span>{{ $t('cleaning') }}</span>
            </div>
            <div class="basis-2/3">
              <div v-if="isLoading"
                class="w-full bg-blue-600 py-3 select-none text-white rounded-lg flex items-center justify-center">
                <Spinners270RingIcon class="mr-2 w-5 h-5 text-gray-200 animate-spin fill-gray-600 dark:fill-gray-300" />
                <span>{{ $t('loading') }}</span>
              </div>
              <div v-else @click="submitRecentStatsFilterData()"
                class="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer select-none py-3 text-white rounded-lg flex items-center justify-center">
                <span>{{ $t('filter') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button @click="openHiddenRecentProductsModal"
      class="w-full md:w-auto py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">{{t('hiddenProducts')}}</button>
    </div>
  </div>
  <div v-if="isLoading" class="flex items-center justify-center h-20">
    <Spinners270RingIcon class="w-6 h-6 text-gray-500 dark:text-zinc-300 animate-spin" />
  </div>
  <CTable v-else :data="recentProducts" :key="renderKey" :columns="columns" :filter="globalSearchFromTable" />
</template>

<style scoped></style>