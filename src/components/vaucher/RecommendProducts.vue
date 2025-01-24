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
import { roundFloatToTwoDecimal } from '@/mixins/utils'

const { t } = useI18n()
const isLoading = ref(false)
const globalSearchFromTable = ref('')
const productStats = ref()
const productStore = useProductStore()
const recommendProducts = computed(() => productStore.recommendProducts)
const renderKey = computed(() => productStore.renderKey)



const columns = [
  {
    accessorKey: 'id',
    header: t('n'),
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
    enableSorting: false,
  },
  {
    accessorKey: 'productName',
    header: t('productName')
  },
  {
    accessorKey: 'packaging',
    header: t('productName')
  },
  {
    accessorKey: 'salesRatio',
    header: t('salesRatio')
  },
  {
    accessorKey: 'totalAmount',
    header: t('totalAmount'),
    cell: ({ row }) => roundFloatToTwoDecimal(row.original.totalAmount),
  },
  {
    accessorKey: 'saleType',
    header: t('saleType')
  },
  {
    accessorKey: 'totalOrders',
    header: t('totalOrders')
  },
  {
    accessorKey: 'totalRevenue',
    header: t('totalRevenue'),
  },
  {
    accessorKey: 'totalProfit',
    header: t('totalProfit')
  },
  {
    accessorKey: 'left',
    header: t('left')
  },
  {
    accessorKey: 'actions',
    header: t('actions'),
    cell: ({ row }) => h('div', { class: 'flex items-center space-x-2' }, [
      h('button', {
        onClick: () => {
          openDeleteRecommendProductModal(row.original)
        },
      }, [
        h(EyeSlashIcon, { class: 'w-6 h-6 text-red-600 hover:scale-105' }),
      ]),
    ]),
    enableSorting: false,
  },
]

const openDeleteRecommendProductModal = (data) => {
  useModalStore().openDeleteRecommendProductModal()
  productStore.setSelectedProduct(data)
}

const openHiddenRecommendProductsModal = () => {
  ProductService.getHiddenRecommendProducts(1, 30).then((res) => {
    productStore.clearStore()
    productStore.setHiddenRecommendProducts(res.data)
    useModalStore().openHiddenRecommendProductsModal()
  })
}

const filterRecommendData = reactive({
  intervalType: productStore.intervalType,
  limit: productStore.limit,
})

const cleanFilterRecommendData = () => {
  filterRecommendData.intervalType = ""
  filterRecommendData.limit = 0
}

const submitRecommendProductsFilterData = () => {
  if (!filterRecommendData.intervalType) {
    toast.warning(t('plsSelectIntervalType'))
  } else if (!filterRecommendData.limit) {
    toast.warning(t('plsSelectLimit'))
  } else {
    isLoading.value = true
    productStore.setIntervalType(filterRecommendData.intervalType)
    productStore.setLimit(filterRecommendData.limit)
    ProductService.getRecommendProducts({
      intervalType: filterRecommendData.intervalType,
      limit: filterRecommendData.limit,
    }).then((res) => {
      productStore.clearStore()
      productStore.setRecommendProducts(res)
      isLoading.value = false
      if (useDropdownStore().isOpenRecommendFilterBy) {
        useDropdownStore().toggleRecommendFilterBy()
      }
    }).catch(() => {
      isLoading.value = false
    })
  }
}

const getRecommendProducts = () => {
  isLoading.value = true
  ProductService.getRecommendProducts(
    {
      intervalType: filterRecommendData.intervalType,
      limit: filterRecommendData.limit
    }
  )
    .then((res) => {
      productStore.clearStore()
      productStore.setRecommendProducts(res)
    }).finally(() => {
      isLoading.value = false
    })
}

onMounted(() => {
  cleanFilterRecommendData
  getRecommendProducts()
})

const recommendDropdown = ref()

onClickOutside(recommendDropdown, () => {
  if (useDropdownStore().isOpenRecommendFilterBy) {
    useDropdownStore().toggleRecommendFilterBy()
  }
})
</script>

<template>
  <div class="text-slate-900 text-2xl md:text-3xl font-semibold mb-6">
    {{ $t('recommendProducts') }}
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
      <div class="relative" ref="recommendDropdown">
        <div @click="useDropdownStore().toggleRecommendFilterBy()"
          class="border-none w-40 select-none text-gray-900 bg-white dark:text-zinc-200 dark:bg-slate-800 shadow rounded-lg p-2 px-5 flex items-center hover:bg-gray-100 cursor-pointer space-x-1">
          <FunnelIcon class="w-5 h-5 dark:text-zinc-50 text-gray-400" />
          <span>{{ $t('filter') }}</span>
        </div>
        <div v-if="useDropdownStore().isOpenRecommendFilterBy"
          class="absolute dark:bg-slate-800  w-80  bg-white shadow rounded-xl  p-3 z-20 top-12 right-0 space-y-3">
          <div class=" items-center space-x-1">
            <div class="flex">
            </div>
            <div class="flex justify-between space-x-4"><label for="" class="dark:text-white w-1/2">
                {{ $t('limit') }}
                <input v-model="filterRecommendData.limit" type="number" min="0"
                  class="border-none text-gray-500 bg-gray-100 rounded-lg     dark:bg-slate-600 dark:text-white w-full" />
              </label>
              <label for="" class="dark:text-white w-1/2">
                {{ $t('intervalType') }}
                <select v-model="filterRecommendData.intervalType"
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
            <div @click="cleanFilterRecommendData()"
              class="basis-1/3 w-full bg-slate-100 hover:bg-slate-300 cursor-pointer select-none py-3 rounded-lg flex items-center justify-center">
              <span>{{ $t('cleaning') }}</span>
            </div>
            <div class="basis-2/3">
              <div v-if="isLoading"
                class="w-full bg-blue-600 py-3 select-none text-white rounded-lg flex items-center justify-center">
                <Spinners270RingIcon class="mr-2 w-5 h-5 text-gray-200 animate-spin fill-gray-600 dark:fill-gray-300" />
                <span>{{ $t('loading') }}</span>
              </div>
              <div v-else @click="submitRecommendProductsFilterData()"
                class="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer select-none py-3 text-white rounded-lg flex items-center justify-center">
                <span>{{ $t('filter') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button @click="openHiddenRecommendProductsModal"
        class="w-full md:w-auto py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">{{ t('hiddenRecommendProducts') }}</button>
    </div>
  </div>
  <div v-if="isLoading" class="flex items-center justify-center h-20">
    <Spinners270RingIcon class="w-6 h-6 text-gray-500 dark:text-zinc-300 animate-spin" />
  </div>
  <CTable v-else :data="recommendProducts" :key="renderKey" :columns="columns" :filter="globalSearchFromTable" />
</template>

<style scoped></style>