<script setup>
import { useModalStore } from '../../store/modal.store.js'
import { useProductStore } from '../../store/product.store.js'
import CModal from '../common/CModal.vue'
import WarningCircleBoldIcon from '../../assets/icons/WarningCircleBoldIcon.vue'
import ProductService from '../../services/product.service.js'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t } = useI18n()
const isLoading = ref(false)
const productStore = useProductStore()

const closeModal = () => {
  useModalStore().closeUnhideUnprofitableProductModal()
  productStore.setSelectedProduct({})
}

const unhideUnprofitableProduct = () => {
  ProductService.unhideUnprofitableProduct(useProductStore().selectedHiddenUnprofitableProduct.productId)
    .then(() => {
      toast.success(t('unprofitableUnhidedSuccessfully'))
      ProductService.getHiddenUnprofitableProducts(1, 30)
        .then((res) => {
          productStore.clearHiddenUnprofitableProducts()
          productStore.setHiddenUnprofitableProducts(res.data)

          ProductService.getUnprofitableProducts({
            intervalType: productStore.intervalType,
            limit: productStore.limit,
          }).then((res) => {
            productStore.clearUnprofitableProducts()
            productStore.setUnprofitableProducts(res)
            productStore.renderKey += 1
            closeModal()
          })
        })
        .catch(() => {
          toast.error(t('errorWhileDeletingUnprofitable'))
          isLoading.value = false
        })
        .finally(() => {
          isLoading.value = false
        })
    })
}
</script>

<template>
  <CModal :is-open="useModalStore().isOpenUnhideUnprofitableProductModal"
    v-if="useModalStore().isOpenUnhideUnprofitableProductModal" @close=closeModal>
    <template v-slot:header>
      {{ $t('unhideUnprofitableProduct') }}
    </template>
    <template v-slot:body>
      <div class="flex items-center justify-center">
        <div class="py-8 border border-red-300 rounded-2xl w-full md:w-2/3 max-w-md md:max-w-lg">
          <div class="flex flex-col items-center space-y-4">
            <WarningCircleBoldIcon class="text-slate-400 dark:text-white w-14 h-14" />
            <h3 class="mb-5 text-lg md:text-xl text-center font-normal dark:text-white text-slate-500">
              {{ $t('areYouSureYouWantToUnhideThisInformation') }}
            </h3>
            <div
              class="flex flex-col md:flex-row items-center justify-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
              <button type="button" @click="closeModal()"
                class="w-full md:w-auto py-2 px-4 rounded-xl text-gray-900 text-base font-medium bg-slate-50 cursor-pointer hover:bg-slate-200 border md:flex-1">
                {{ $t('no') }}
              </button>
              <button @click="unhideUnprofitableProduct()"
                class="w-full md:w-auto py-2 px-4 rounded-xl text-white text-base font-medium bg-red-600 cursor-pointer hover:bg-red-700">
                {{ $t('yesOfCourse') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CModal>
</template>