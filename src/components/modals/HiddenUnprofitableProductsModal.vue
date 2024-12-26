<script setup>
import { vMaska } from 'maska'
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
const hiddenUnprofitableProducts = computed(() => productStore.hiddenUnprofitableProducts)

const columns = [
  {
    accessorKey: 'id',
    header: t('n'),
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
  },
  {
    accessorKey: 'name',
    header: t('name'),
  },
  {
    accessorKey: 'packaging',
    header: t('packaging'),
  },
  {
    accessorKey: 'actions',
    header: t('actions'),
    cell: ({ row }) => h('div', { class: 'flex items-center space-x-2' }, [
      h('button', {
        onClick: () => {
          openUnhideUnprofitableProductModal(row.original)
        },
      }, [
        h(EyeIcon, { class: 'w-6 h-6 text-blue-600 dark:text-blue-400 hover:scale-105' }),
      ]),
    ]),
    enableSorting: false,
  },
]

const openUnhideUnprofitableProductModal = (data) => {
  useProductStore().setSelectedHiddenUnprofitableProduct(data)
  useModalStore().openUnhideUnprofitableProductModal()
}

const filterUnprofitableData = reactive({
  intervalType: useProductStore().intervalType,
  limit: useProductStore().limit,
})

const cleanFilterUnprofitableData = () => {
  filterUnprofitableData.intervalType = ""
  filterUnprofitableData.limit = 0
}

const getUnprofitableStats = () => {
  isLoading.value = true
  ProductService.getUnprofitableStats(
    {
      intervalType: filterUnprofitableData.intervalType,
      limit: filterUnprofitableData.limit
    }
  )
    .then((res) => {
      useProductStore().clearStore()
      useProductStore().setUnprofitableProducts(res)
    }).finally(() => {
      isLoading.value = false
    })
}

onMounted(() => {
  cleanFilterUnprofitableData
  getUnprofitableStats()
  // ProductService.getProductStats()
  //   .then((res) => {
  //     productStats.value = res
  //   })
})

const closeModal = () => {
  useModalStore().closeHiddenUnprofitableProductsModal()
  productStore.setSelectedProduct({})
}
</script>
<template>
  <CModal :is-open="useModalStore().isOpenHiddenUnprofitableProductsModal"
    v-if="useModalStore().isOpenHiddenUnprofitableProductsModal" @close=closeModal :key="renderKey">
    <template v-slot:header>
      {{ $t('hiddenUnprofitableProducts') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <CTable :data="hiddenUnprofitableProducts" :columns="columns" />
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
    </template>
  </CModal>
</template>

<style scoped></style>