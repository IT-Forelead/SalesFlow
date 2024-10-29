<script setup>
import { ref } from 'vue'
import CModal from '../common/CModal.vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import SaveButton from '../buttons/SaveButton.vue'
import { useProductStore } from '../../store/product.store.js'
import { computed, reactive, watchEffect } from 'vue'
import ProductService from '../../services/product.service.js'
import ProductHistoryService from '../../services/productHistory.service.js'
import { useProductHistoryStore } from '../../store/productHistory.store.js'
import SearchIcon from '../../assets/icons/SearchIcon.vue'
import useMoneyFormatter from '../../mixins/currencyFormatter.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const isLoading = ref(false)
const productStore = useProductStore()
const selectedProduct = ref()
const isOpen = ref(true)
const search = ref('')
let products = computed(() => {
  return productStore.products
})
const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

const submitData = reactive({
  quantity: 0,
  productHistoryType: '',
  purchasePrice: 0,
  salePrice: 0,
})

const clearSubmitData = () => {
  submitData.productHistoryType = ''
  submitData.purchasePrice = 0
  submitData.salePrice = 0
  submitData.quantity = 0
}

const createProductHistory = () => {
  if (!selectedProduct.value?.id) {
    toast.warning(t('plsSelectProduct'))
  } else if (!submitData.quantity) {
    toast.warning(t('plsEnterQuantity'))
  } else if (!submitData.productHistoryType) {
    toast.warning(t('plsSelectProductHistoryType'))
  } else if (submitData.purchasePrice === 0) {
    toast.warning(t('plsEnterThePurchasePrice'))
  } else if (submitData.salePrice === 0) {
    toast.warning(t('plsEnterTheSellingPrice'))
  } else {
    isLoading.value = true
    ProductHistoryService.createProductHistory({
      productId: selectedProduct.value?.id,
      quantity: submitData.quantity,
      historyType: submitData.productHistoryType,
      purchasePrice: submitData.purchasePrice,
      salePrice: submitData.salePrice,
    }).then(() => {
      toast.success(t('productHistorySuccessfullyAdded'))
      isLoading.value = false
      ProductHistoryService.getProductHistories({})
        .then((res) => {
          useProductHistoryStore().clearStore()
          useProductHistoryStore().setProductHistories(res)
        })
      closeModal()
    })
      .catch((err) => {
        toast.error(t('errorWhileCreatingProductHistory'))
        isLoading.value = false
      })
  }
}

const getProducts = () => {
  isLoading.value = true
  ProductService.getProducts({})
    .then((res) => {
      useProductStore().clearStore()
      useProductStore().setProducts(res.data)
    }).finally(() => {
      isLoading.value = false
    })
}

watchEffect(() => {
  if (useModalStore().isOpenCreateProductHistoryModal === true) {
    getProducts()
  }
})

const searchResults = computed(() => {
  if (search.value === '') {
    return []
  }
  const searchString = search.value.toLowerCase()
  return products.value.filter(item => {
    const barcodeString = item.barcode?.toString()
    return (
      item.name.toLowerCase().includes(searchString) ||
      barcodeString?.includes(searchString)
    )
  })
})
const setSelectedProduct = (product) => {
  isOpen.value = false
  selectedProduct.value = product
}

const closeModal = () => {
  useModalStore().closeCreateProductHistoryModal()
  clearSubmitData()
  search.value = ''
  selectedProduct.value = null
}
</script>

<template>
  <CModal :is-open="useModalStore().isOpenCreateProductHistoryModal"
    v-if="useModalStore().isOpenCreateProductHistoryModal" @close=closeModal>
    <template v-slot:header>
      {{ $t('createProductHistory') }}
    </template>
    <template v-slot:body>
      <div class="w-full relative mb-4">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5" />
        </div>
        <input type="text" v-model="search" :placeholder="t('searchByProductNameOrBarcode')"
          class="bg-slate-100 border-none rounded-lg w-full h-12 pl-10 placeholder-slate-400"
          @input="isOpen = true">
        <ul v-if="searchResults.length && isOpen"
          class="mt-1 w-full max-h-60 overflow-y-auto absolute z-10 bg-white dark:bg-slate-600 border border-slate-200 rounded-xl shadow-md">
          <li class="px-4 py-3 border-b border-slate-200 cursor-pointer hover:bg-slate-100"
            v-for="result in searchResults" :key="result.id" @click="setSelectedProduct(result)">
            <span class="font-semibold">{{ result.name }}</span> - {{ result.packaging }}
          </li>
        </ul>
      </div>
      <div v-if="selectedProduct" class="space-y-4">
        <div class="w-full mb-10">
          <div class="border-b border-gray-200 py-3">
            <p class="dark:text-white text-base font-normal">
              {{ $t('productName') }}
            </p>
            <h1 class="text-2xl font-semibold dark:text-white mt-2">
              {{ selectedProduct.name }} {{ selectedProduct.packaging }}
            </h1>
          </div>
          <div class="py-4 border-b border-slate-200 flex items-center justify-between">
            <p class="text-neutral-800 dark:text-white text-base font-normal">
              {{ $t('barcode') }}
            </p>
            <p class="text-sm leading-none text-gray-600 dark:text-white">
              {{ selectedProduct.barcode }}
            </p>
          </div>
          <div class="py-4 border-b border-slate-200 flex items-center justify-between">
            <p class="text-neutral-800 dark:text-white text-base font-normal">
              {{ $t('quantity') }}
            </p>
            <p class="text-sm leading-none text-gray-600 dark:text-white mr-3">
              {{ selectedProduct.quantity }}
            </p>
          </div>
          <div class="py-4 border-b border-slate-200 flex items-center justify-between">
            <p class="text-neutral-800 dark:text-white text-base font-normal">
              {{ $t('price') }}
            </p>
            <p class="text-sm leading-none text-gray-600 dark:text-white mr-3">
              {{ useMoneyFormatter(selectedProduct.price) }}
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1 space-y-1">
            <label for="default-value"
              class="block mb-2 text-neutral-800 dark:text-white text-base font-normal after:text-red-500 after:content-['*']">
              {{ $t('quantity') }}
            </label>
            <input id="default-value" type="text" v-model="submitData.quantity"
              class="bg-slate-50 border border-slate-200 text-slate-900 dark:text-white text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5"
              :placeholder="t('enterQuantity')">
          </div>
          <div class="flex-1 space-y-1">
            <label for="product-history-type"
              class="block mb-2 text-neutral-800 dark:text-white text-base font-normal after:text-red-500 after:content-['*']">
              {{ $t('productHistoryType') }}
            </label>
            <select id="product-history-type" v-model="submitData.productHistoryType"
              class="bg-slate-50 border border-slate-200 text-slate-900 dark:text-white text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5">
              <option selected>{{ $t('selectType') }}</option>
              <option value="purchased">{{ $t('income') }}</option>
              <option value="returned">{{ $t('returned') }}</option>
            </select>
          </div>
        </div>
        <div class="flex items-center justify-between space-x-4">
          <div class="flex-1 space-y-1">
            <label for="price"
              class="block mb-2 text-neutral-800 dark:text-white text-base font-normal after:text-red-500 after:content-['*']">
              {{ $t('purchasePrice') }}
            </label>
            <money3 id="price" v-bind="moneyConf" v-model.number="submitData.purchasePrice"
              class="bg-slate-50 text-right border border-slate-200 text-slate-900 dark:text-white text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5">
            </money3>
          </div>
          <div class="flex-1 space-y-1">
            <label for="price"
              class="block mb-2 text-neutral-800 dark:text-white text-base font-normal after:text-red-500 after:content-['*']">
              {{ $t('salePrice') }}
            </label>
            <money3 id="price" v-bind="moneyConf" v-model.number="submitData.salePrice"
              class="bg-slate-50 text-right border border-slate-200 text-slate-900 dark:text-white text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5">
            </money3>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center border-2 border-dashed h-96 rounded-3xl space-y-1">
        <h4 class="text-slate-900 dark:text-white text-xl font-semibold">
          {{ $t('productNotFound') }}
        </h4>
        <div class="text-slate-600 text-base text-center">
          {{ $t('plsSelectProduct') }}
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <SaveButton :isLoading="isLoading" @click="createProductHistory" />
      <CancelButton @click="closeModal" />
    </template>
  </CModal>
</template>
