<script setup>
import { reactive, ref, computed, h, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import { cleanObjectEmptyFields } from '../../mixins/utils'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import CModal from '../common/CModal.vue'
import CTable from '../../components/common/CTable.vue'
import { useI18n } from 'vue-i18n'
import ProductService from '../../services/product.service.js'
import { useProductStore } from '../../store/product.store.js'
import EyeIcon from '@/assets/icons/EyeIcon.vue'

const { t } = useI18n()
const productStore = useProductStore()
const renderKey = computed(() => productStore.renderKey)
// const page = ref(1)
// const pageSize = 30
const isLoading = ref(false)
const hiddenRecentProducts = computed(() => productStore.hiddenRecentProducts)

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
          openUnhideRecentProductModal(row.original)
        },
      }, [
        h(EyeIcon, { class: 'w-6 h-6 text-blue-600 dark:text-blue-400 hover:scale-105' }),
      ]),
    ]),
    enableSorting: false,
  },
]

const openUnhideRecentProductModal = (data) => {
  useProductStore().setSelectedHiddenRecentProduct(data)
  useModalStore().openUnhideRecentProductModal()
}

const filterRecentData = reactive({
  intervalType: useProductStore().intervalType,
  limit: useProductStore().limit,
})

const cleanFilterRecentData = () => {
  filterRecentData.intervalType = ""
  filterRecentData.limit = 0
}

const getRecentlyProducts = () => {
  isLoading.value = true
  ProductService.getRecentlyProducts(
    {
      intervalType: filterRecentData.intervalType,
      limit: filterRecentData.limit
    }
  )
    .then((res) => {
      useProductStore().clearStore()
      useProductStore().setRecentProducts(res)
    }).finally(() => {
      isLoading.value = false
    })
}

onMounted(() => {
  cleanFilterRecentData
  getRecentlyProducts()
  
})

const closeModal = () => {
  useModalStore().closeHiddenRecentProductsModal()
  productStore.setSelectedProduct({})
}
</script>
<template>
  <CModal :is-open="useModalStore().isOpenHiddenRecentProductsModal"
    v-if="useModalStore().isOpenHiddenRecentProductsModal" @close=closeModal :key="renderKey">
    <template v-slot:header>
      {{ $t('hiddenRecentProducts') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <CTable :data="hiddenRecentProducts" :columns="columns" />
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
    </template>
  </CModal>
</template>

<style scoped></style>