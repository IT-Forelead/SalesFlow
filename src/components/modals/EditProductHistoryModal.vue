<script setup>
import CModal from '../common/CModal.vue'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import SaveButton from '../buttons/SaveButton.vue'
import { computed, reactive, ref, watch } from 'vue'
import { useProductHistoryStore } from '../../store/productHistory.store.js'
import { useProductStore } from '../../store/product.store.js'
import useMoneyFormatter from '../../mixins/currencyFormatter.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const productStore = useProductStore()
const productHistoryStore = useProductHistoryStore()
const selectedProductHistory = computed(() => {
  return productHistoryStore.selectedProductHistory
})

const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

const submitData = reactive({
  id: '',
  quantity: 0,
  productHistoryType: '',
  purchasePrice: 0,
  salePrice: 0,
})

const clearSubmitData = () => {
  submitData.id = ''
  submitData.productHistoryType = ''
  submitData.purchasePrice = 0
  submitData.salePrice = 0
  submitData.quantity = 0
}

watch(
  () => selectedProductHistory.value,
  (data) => {
    if (data) {
      submitData.id = data?.id
      submitData.quantity = data?.quantity
      submitData.productHistoryType = data?.historyType
      submitData.purchasePrice = data?.purchasePrice
      submitData.salePrice = data?.salePrice
    }
  },
  { deep: true }
)

const getHistoryType = (historyType) => {
  switch (historyType) {
    case 'purchased':
      return t('income')
    case 'returned':
      return t('returned')
    default:
      return t('unknown')
  }
}

const getProductName = (productId) => {
  const product = productStore.products.find(product => product.id === productId);
  return product?.name + " - " + product?.packaging
}

const closeModal = () => {
  useModalStore().closeEditProductHistoryModal()
  useProductHistoryStore().setSelectedProductHistory({})
  clearSubmitData()
}
</script>

<template>
  <CModal :is-open="useModalStore().isOpenEditProductHistoryModal" v-if="useModalStore().isOpenEditProductHistoryModal"
    @close=closeModal>
    <template v-slot:header>
      {{ $t('editProductHistory') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="w-full mb-10">
          <div class="border-b border-gray-200 flex items-center justify-between">
            <p class="text-neutral-800 text-base font-normal">
              {{ $t('productName') }}
            </p>
            <h1 class="md:text-2xl font-semibold text-neutral-800 mt-2">
              {{ getProductName(selectedProductHistory?.productId) }} {{ selectedProductHistory?.packaging }}
            </h1>
          </div>
          <div class="py-4 border-b border-slate-200 flex items-center justify-between">
            <p class="text-neutral-800 text-base font-normal">
              {{ $t('productHistoryType') }}
            </p>
            <p class="text-sm leading-none text-gray-600 mr-3">
              {{ getHistoryType(selectedProductHistory?.historyType) }}
            </p>
          </div>
          <div class="py-4 border-b border-slate-200 flex items-center justify-between">
            <p class="text-neutral-800 text-base font-normal">
              {{ $t('quantity') }}
            </p>
            <p class="text-sm leading-none text-gray-600 mr-3">
              {{ selectedProductHistory?.quantity }}
            </p>
          </div>
          <div class="py-4 border-b border-slate-200 flex items-center justify-between">
            <p class="text-neutral-800 text-base font-normal">
              {{ $t('purchasePrice') }}
            </p>
            <p class="text-sm leading-none text-gray-600 mr-3">
              {{ useMoneyFormatter(selectedProductHistory?.purchasePrice) }}
            </p>
          </div>
          <div class="py-4 border-b border-slate-200 flex items-center justify-between">
            <p class="text-neutral-800 text-base font-normal">
              {{ $t('salePrice') }}
            </p>
            <p class="text-sm leading-none text-gray-600 mr-3">
              {{ useMoneyFormatter(selectedProductHistory?.salePrice) }}
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1 space-y-1">
            <label for="default-value"
              class="block text-left mb-2 text-neutral-800 text-base font-normal after:text-red-500 after:content-['*']">
              {{ $t('quantity') }}
            </label>
            <input id="default-value" type="text" v-model="submitData.quantity"
              class="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5"
              :placeholder="t('enterQuantity')">
          </div>
          <div class="flex-1 space-y-1">
            <label for="product-history-type"
              class="block text-left mb-2 text-neutral-800 text-base font-normal after:text-red-500 after:content-['*']">
              {{ $t('productHistoryType') }}
            </label>
            <select id="product-history-type" v-model="submitData.productHistoryType"
              class="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5">
              <option selected>{{ $t('selectType') }}</option>
              <option value="purchased">{{ $t('income') }}</option>
              <option value="returned">{{ $t('returned') }}</option>
            </select>
          </div>
        </div>
        <div class="flex items-center justify-between space-x-4">
          <div class="flex-1 spaceSearchIcon-y-1">
            <label for="price"
              class="block text-left mb-2 text-neutral-800 text-base font-normal after:text-red-500 after:content-['*']">
              {{ $t('purchasePrice') }}
            </label>
            <money3 id="price" v-bind="moneyConf" v-model.number="submitData.purchasePrice"
              class="bg-slate-50 text-right border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5">
            </money3>
          </div>
          <div class="flex-1 spaceSearchIcon-y-1">
            <label for="price"
              class="block text-left mb-2 text-neutral-800 text-base font-normal after:text-red-500 after:content-['*']">
              {{ $t('salePrice') }}
            </label>
            <money3 id="price" v-bind="moneyConf" v-model.number="submitData.salePrice"
              class="bg-slate-50 text-right border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5">
            </money3>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <SaveButton />
      <CancelButton @click="closeModal" />
    </template>
  </CModal>
</template>