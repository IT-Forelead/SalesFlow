<script setup>
import { vMaska } from 'maska'
import { reactive, ref, computed, h, onMounted } from 'vue'
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
const isLoading = ref(false)
const hiddenProducts = computed(() => productStore.hiddenProducts)

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
          openUnhideRecommendProductModal(row.original)
        },
      }, [
        h(EyeIcon, { class: 'w-6 h-6 text-blue-600 dark:text-blue-400 hover:scale-105' }),
      ]),
    ]),
    enableSorting: false,
  },
]

const openUnhideRecommendProductModal = (data) => {
  useProductStore().setSelectedHiddenProduct(data)
  useModalStore().openUnhideRecommendProductModal()
}

const filterRecommendData = reactive({
  intervalType: useProductStore().intervalType,
  limit: useProductStore().limit,
})

const cleanFilterRecommendData = () => {
  filterRecommendData.intervalType = ""
  filterRecommendData.limit = 0
}

const getRecommendStats = () => {
  isLoading.value = true
  ProductService.getRecommendStats(
    {
      intervalType: filterRecommendData.intervalType,
      limit: filterRecommendData.limit
    }
  )
    .then((res) => {
      useProductStore().clearStore()
      useProductStore().setRecommendProducts(res)
    }).finally(() => {
      isLoading.value = false
    })
}

onMounted(() => {
  cleanFilterRecommendData
  getRecommendStats()
  // ProductService.getProductStats()
  //   .then((res) => {
  //     productStats.value = res
  //   })
})

const closeModal = () => {
  useModalStore().closeHiddenRecommendProductsModal()
  productStore.setSelectedProduct({})
}
</script>
<template>
  <CModal :is-open="useModalStore().isOpenHiddenRecommendProductsModal"
    v-if="useModalStore().isOpenHiddenRecommendProductsModal" @close=closeModal :key="renderKey">
    <template v-slot:header>
      {{ $t('hiddenProducts') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <CTable :data="hiddenProducts" :columns="columns" />
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
    </template>
  </CModal>
</template>

<style scoped></style>