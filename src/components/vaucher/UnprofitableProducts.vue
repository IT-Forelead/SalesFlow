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
// const productStats = ref()
const productStore = useProductStore()

const unprofitableProducts = computed(() => productStore.unprofitableProducts)
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
    accessorKey: 'name',
    header: t('name'),
  },
  {
    accessorKey: 'packaging',
    header: t('packaging')
  },
  {
    accessorKey: 'barcode',
    header: t('barcode')
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
          openDeleteUnprofitableProductModal(row.original)
        },
      }, [
        h(EyeSlashIcon, { class: 'w-6 h-6 text-red-600 hover:scale-105' }),
      ]),
    ]),
    enableSorting: false,
  },
]

const openDeleteUnprofitableProductModal = (data) => {
  useModalStore().openDeleteUnprofitableProductModal()
  productStore.setSelectedProduct(data)
}

const openHiddenUnprofitableProductsModal = () => {
  ProductService.getHiddenUnprofitableProducts(1, 30).then((res) => {
    productStore.clearStore()
    productStore.setHiddenUnprofitableProducts(res.data)
    useModalStore().openHiddenUnprofitableProductsModal()
  })
}

const filterUnprofitableData = reactive({
  intervalType: productStore.intervalType,
  limit: productStore.limit,
})

const cleanFilterUnprofitableData = () => {
  filterUnprofitableData.intervalType = ""
  filterUnprofitableData.limit = 0
}

const submitUnprofitableStatsFilterData = () => {
  if (!filterUnprofitableData.intervalType) {
    toast.warning(t('plsSelectIntervalType'))
  } else if (!filterUnprofitableData.limit) {
    toast.warning(t('plsSelectLimit'))
  } else {
    isLoading.value = true
    productStore.setIntervalType(filterUnprofitableData.intervalType)
    productStore.setLimit(filterUnprofitableData.limit)
    ProductService.getUnprofitableProducts({
      intervalType: filterUnprofitableData.intervalType,
      limit: filterUnprofitableData.limit,
    }).then((res) => {
      productStore.clearStore()
      productStore.setUnprofitableProducts(res)
      isLoading.value = false
      if (useDropdownStore().isOpenUnprofitableFilterBy) {
        useDropdownStore().toggleUnprofitableFilterBy()
      }
    }).catch(() => {
      isLoading.value = false
    })
  }
}

const getUnprofitableProducts = () => {
  isLoading.value = true
  ProductService.getUnprofitableProducts(
    {
      intervalType: filterUnprofitableData.intervalType,
      limit: filterUnprofitableData.limit
    }
  )
    .then((res) => {
      productStore.clearStore()
      productStore.setUnprofitableProducts(res)
    }).finally(() => {
      isLoading.value = false
    })
}

onMounted(() => {
  cleanFilterUnprofitableData
  getUnprofitableProducts()
  // ProductService.getUnprofitableProducts()
  //   .then((res) => {
  //     productStats.value = res
  //   })
})

const unprofitableDropdown = ref()

onClickOutside(unprofitableDropdown, () => {
  if (useDropdownStore().isOpenUnprofitableFilterBy) {
    useDropdownStore().toggleUnprofitableFilterBy()
  }
})
</script>

<template>
  <div class="text-slate-900 text-2xl md:text-3xl font-semibold mb-6">
    {{ $t('unprofitableProducts') }}
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
      <div class="relative" ref="unprofitableDropdown">
        <div @click="useDropdownStore().toggleUnprofitableFilterBy()"
          class="border-none w-40 select-none text-gray-900 bg-white dark:text-zinc-200 dark:bg-slate-800 shadow rounded-lg p-2 px-5 flex items-center hover:bg-gray-100 cursor-pointer space-x-1">
          <FunnelIcon class="w-5 h-5 dark:text-zinc-50 text-gray-400" />
          <span>{{ $t('filter') }}</span>
        </div>
        <div v-if="useDropdownStore().isOpenUnprofitableFilterBy"
          class="absolute dark:bg-slate-800  w-80  bg-white shadow rounded-xl  p-3 z-20 top-12 right-0 space-y-3">
          <div class=" items-center space-x-1">
            <div class="flex">
            </div>
            <div class="flex justify-between space-x-4"><label for="" class="dark:text-white w-1/2">
                {{ $t('limit') }}
                <input v-model="filterUnprofitableData.limit" type="number" min="0"
                  class="border-none text-gray-500 bg-gray-100 rounded-lg     dark:bg-slate-600 dark:text-white w-full" />
              </label>
              <label for="" class="dark:text-white w-1/2">
                {{ $t('intervalType') }}
                <select v-model="filterUnprofitableData.intervalType"
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
            <div @click="cleanFilterUnprofitableData()"
              class="basis-1/3 w-full bg-slate-100 hover:bg-slate-300 cursor-pointer select-none py-3 rounded-lg flex items-center justify-center">
              <span>{{ $t('cleaning') }}</span>
            </div>
            <div class="basis-2/3">
              <div v-if="isLoading"
                class="w-full bg-blue-600 py-3 select-none text-white rounded-lg flex items-center justify-center">
                <Spinners270RingIcon class="mr-2 w-5 h-5 text-gray-200 animate-spin fill-gray-600 dark:fill-gray-300" />
                <span>{{ $t('loading') }}</span>
              </div>
              <div v-else @click="submitUnprofitableStatsFilterData()"
                class="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer select-none py-3 text-white rounded-lg flex items-center justify-center">
                <span>{{ $t('filter') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button @click="openHiddenUnprofitableProductsModal"
        class="w-full md:w-auto py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">{{ t('hiddenUnprofitableProducts') }}</button>
    </div>
  </div>
  <div v-if="isLoading" class="flex items-center justify-center h-20">
    <Spinners270RingIcon class="w-6 h-6 text-gray-500 dark:text-zinc-300 animate-spin" />
  </div>
  <CTable v-else :data="unprofitableProducts" :key="renderKey" :columns="columns" :filter="globalSearchFromTable" />
</template>

<style scoped></style>