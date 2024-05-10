<script setup>
import { useModalStore } from '../../store/modal.store.js'
import CModal from '../common/CModal.vue'
import { useProductStore } from '../../store/product.store.js'
import { computed } from 'vue'
import WarningCircleBoldIcon from '../../assets/icons/WarningCircleBoldIcon.vue'
import useMoneyFormatter from '../../mixins/currencyFormatter.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const productStore = useProductStore()
const selectedProduct = computed(() => {
  return productStore.selectedProduct
})

const saleType = (type) => {
  switch (type) {
    case 'amount':
      return 'Donali'
    case 'litre':
      return 'Litrli'
    case 'kg':
      return 'Kilogrammli'
    case 'g':
      return 'Grammli'
  }
}

const closeModal = () => {
  useModalStore().closeDeleteProductModal()
  useProductStore().setSelectedProduct({})
}

</script>

<template>
  <CModal :is-open="useModalStore().isOpenDeleteProductModal" v-if="useModalStore().isOpenDeleteProductModal"
    @close=closeModal>
    <template v-slot:header>
      {{ $t('deleteProduct') }}
    </template>
    <template v-slot:body>
      <div class="space-y-16">
        <div class="space-y-2">
          <div class="bg-slate-100 px-3 text-center py-2 text-lg font-medium rounded-xl">
            {{ $t('productInformation') }}
          </div>
          <ul class="divide-y divide-slate-100">
            <li class="flex items-center justify-between py-2 px-3">
              <div class="text-base">
                {{ $t('productName') }}
              </div>
              <div class="text-base font-medium">
                {{ selectedProduct?.name }}
              </div>
            </li>
            <li class="flex items-center justify-between py-2 px-3">
              <div class="text-base">
                {{ $t('package') }}
              </div>
              <div class="text-base font-medium">
                {{ selectedProduct?.packaging }}
              </div>
            </li>
            <li class="flex items-center justify-between py-2 px-3">
              <div class="text-base">
                {{ $t('barcode') }}
              </div>
              <div class="text-base font-medium">
                {{ selectedProduct?.barcode }}
              </div>
            </li>
            <li class="flex items-center justify-between py-2 px-3">
              <div class="text-base">
                {{ $t('quantity') }}
              </div>
              <div class="text-base font-medium">
                {{ selectedProduct?.quantity }}
              </div>
            </li>
            <li class="flex items-center justify-between py-2 px-3">
              <div class="text-base">
                {{ $t('saleType') }}
              </div>
              <div class="text-base font-medium">
                {{ saleType(selectedProduct?.saleType) }}
              </div>
            </li>
            <li class="flex items-center justify-between py-2 px-3">
              <div class="text-base">
                {{ $t('price') }}
              </div>
              <div class="text-base font-medium">
                {{ useMoneyFormatter(selectedProduct?.price) }}
              </div>
            </li>
          </ul>
        </div>
        <div class="flex items-center justify-center">
          <div class="border border-red-300 rounded-2xl w-full md:w-2/3 max-w-md md:max-w-lg">
            <div class="flex flex-col items-center space-y-4">
              <WarningCircleBoldIcon class="text-slate-400 w-14 h-14" />
              <h3 class="mb-5 text-lg md:text-xl text-center font-normal text-slate-500">
                {{ $t('areYouSureYouWantToDeleteThisInformation') }}
              </h3>
              <div
                class="flex py-4 flex-col md:flex-row items-center justify-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                <button type="button" @click="closeModal()"
                  class="w-full md:w-auto py-2 px-4 rounded-xl text-gray-900 text-base font-medium bg-slate-50 cursor-pointer hover:bg-slate-200 border md:flex-1">
                  {{ $t('no') }}
                </button>
                <button
                  class="w-full md:w-auto py-2 px-4 rounded-xl text-white text-base font-medium bg-red-600 cursor-pointer hover:bg-red-700">
                  {{ $t('yesOfCourse') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CModal>
</template>