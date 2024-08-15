<script setup>
import { cleanObjectEmptyFields } from '../../mixins/utils'
import CModal from '../common/CModal.vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store'
import { useProductStore } from '../../store/product.store'
import CancelButton from '../buttons/CancelButton.vue'
import SearchIcon from '../../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import BarcodeIcon from '../../assets/icons/BarcodeIcon.vue'
import ProductService from '../../services/product.service'
import { computed, reactive, ref, watch } from 'vue'
import { isBarcode } from '../../mixins/barcodeFormatter'
import ImageIcon from '../../assets/icons/ImageIcon.vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import ScrollPanel from 'primevue/scrollpanel'

const { t } = useI18n()

const API_URL = import.meta.env.VITE_CHEQUE_API_URL

const productStore = useProductStore()

const products = computed(() => {
  return productStore.products
})

const onSearchFocus = ref(null)
const isLoading = ref(false)
const isSearching = ref(false)
const search = ref('')
const productBarcode = ref({})
const productBarcodes = ref([])

const submitData = reactive({
  name: '',
  barcode: '',
  quantity: null,
  count: null,
  totalPrice: null,
  productionDate: '',
  expirationDate: '',
})

const clearSubmitData = () => {
  submitData.name = ''
  submitData.barcode = ''
  submitData.quantity = null
  submitData.count = null
  search.value = ''
  submitData.totalPrice = null
  submitData.productionDate = ''
  submitData.expirationDate = ''
}

const closeModal = () => {
  useModalStore().closeCreateLabelModal()
  clearSubmitData()
  productBarcodes.value = []
}

const createLabel = () => {
  if (!submitData.name) {
    toast.warning(t('plsSelectProduct'))
  } else if (!submitData.quantity || submitData.quantity <= 0 || isNaN(submitData.quantity)) {
    toast.warning(t('plsEnterProductQuantity'))
  } else if (!submitData.totalPrice || submitData.totalPrice <= 0 || isNaN(submitData.totalPrice)) {
    toast.warning(t('plsEnterTotalPrice'))
  } else if (!submitData.count || submitData.count <= 0 || isNaN(submitData.count)) {
    toast.warning(t('plsEnterLabelCount'))
  } else {
    isLoading.value = true
    const product = productBarcode.value
    const quantity = product.saleType.includes('kg')
        ? Math.floor(parseFloat(submitData.quantity) * 1000)
        : submitData.quantity
    const barcode = !product.barcode ? `999${String(product.serialId).padStart(5, '0')}${String(quantity).padStart(4, '0')}1` : submitData.barcode

    axios
      .post(
        API_URL + '/print-label',
        cleanObjectEmptyFields({
          name: submitData.name,
          barcode: barcode,
          quantity: Number.parseFloat(submitData.quantity),
          count: Number.parseInt(submitData.count),
          saleType: product.saleType,
          packaging: product.packaging,
          serialId: product.serialId,
          price: product.price,
          totalPrice: product.price * Number.parseFloat(submitData.quantity),
          productionDate: product.productionDate,
          expirationDate: product.expirationDate,
        }),
      )
      .then(async () => {
        toast.success(t('labelCreatedSuccessfully'))
        clearSubmitData()
        isLoading.value = false
      })
      .catch(() => {
        toast.error(t('errorWhileCreatingLabel'))
        setTimeout(() => {
          isLoading.value = false
        }, 3000)
      })
  }
}


const searchProducts = () => {
  if (!search.value) {
    toast.warning(t('plsEnterProductNameOrBarcode'))
  } else {
    isLoading.value = true
    if (isBarcode(search.value)) {
      ProductService.getProductsDetails(
        cleanObjectEmptyFields({
          barcode: search.value,
        }),
      ).then((res) => {
        isLoading.value = false
        if (res.data.length === 0) {
          toast.error(t('productNotFound'))
          search.value = ''
        }
        productBarcodes.value = res.data
      })
    } else if (!isNaN(search.value) && Number.isInteger(+search.value)) {
      ProductService.getProductsDetails(
        cleanObjectEmptyFields({
          serialId: +search.value,
        }),
      ).then((res) => {
        if (res.data.length === 0) {
          toast.error(t('productNotFound'))
          search.value = ''
        } else {
          isLoading.value = false
          productBarcodes.value = res.data
        }
      })
    } else {
      ProductService.getProductsDetails(
        cleanObjectEmptyFields({
          name: search.value,
        }),
      ).then((res) => {
        isLoading.value = false
        productBarcodes.value = res.data
      })
    }
  }
}

const selectedProduct = (product) => {
  productBarcode.value = product
  productBarcodes.value = []
}

const whenPressEnter = (e) => {
  if (e.keyCode === 13) {
    searchProducts()
  }
}

watch(
  () => productBarcode.value,
  (data) => {
    if (data) {
      submitData.barcode = data?.barcode
      submitData.name = data?.name
    }
  },
  { deep: true },
)


const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

watch(
  () => submitData.quantity,
  (newQuantity) => {
    if (newQuantity && !isNaN(newQuantity)) {
      const product = productBarcode.value
      submitData.totalPrice = Math.round(product.price * submitData.quantity)
    } else {
      submitData.totalPrice = null
    }
  },
)
</script>
<template>
  <CModal :is-open="useModalStore().isOpenCreateLabelModal" v-if="useModalStore().isOpenCreateLabelModal"
          @close="closeModal">
    <template v-slot:header>
      {{ $t('createLabel') }}
    </template>
    <template v-slot:body>
      <div class="relative mb-8">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400" />
        </div>
        <input type="search" v-model="search" ref="onSearchFocus" v-on:keypress="whenPressEnter($event)"
               class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-12 pl-10 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
               :placeholder="t('searchByProductNameOrBarcode')" />
        <div class="absolute inset-y-0 right-0 flex items-center space-x-2">
          <div @click="useModalStore().openCameraScannerModal()"
               class="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white cursor-pointer">
            <BarcodeIcon class="w-6 h-6 text-slate-900" />
          </div>
          <button type="button" @click="searchProducts()"
                  class="px-4 bg-[#0167F3] text-white rounded-lg text-base h-full md:text-lg cursor-pointer">
            {{ $t('search') }}
          </button>
        </div>

        <div v-if="productBarcodes.length > 0" class="absolute top-16 left-0 bg-transparent w-full space-y-2 z-[2000]">
          <ScrollPanel style="height: 600px;">
            <div v-for="(product, idx) in productBarcodes" :key="idx" @click="selectedProduct(product)"
                 class="flex items-center justify-between bg-white border shadow-sm rounded-xl px-3 py-2 w-full cursor-pointer hover:bg-slate-100">
              <div class="flex items-center space-x-3">
                <div class="flex items-center justify-center bg-slate-200 w-10 h-10 rounded-lg">
                  <ImageIcon class="text-gray-500 w-8 h-8" />
                </div>
                <div>
                  <div class="text-base font-semibold text-gray-800">
                    {{ product?.name + ' - ' + product?.packaging }}
                  </div>
                  <div class="text-base font-medium text-gray-500">
                    {{ product?.type_code }}
                  </div>
                </div>
              </div>
              <div class="text-base font-semibold text-gray-800">
                {{ product?.barcode }}
              </div>
            </div>
          </ScrollPanel>
        </div>
      </div>
      <div class="space-y-2 md:space-y-4">
        <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div class="flex-1">
            <label for="name" class="text-base md:text-lg font-medium">
              {{ $t('productName') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="name" disabled type="text" v-model="submitData.name"
                   class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
                   :placeholder="t('productName')" />
          </div>
          <div class="flex-1">
            <label for="barcode" class="text-base md:text-lg font-medium">
              {{ $t('barcode') }}
            </label>
            <input id="barcode" disabled type="text" v-model="submitData.barcode"
                   class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
                   :placeholder="t('barcode')" />
          </div>
        </div>
        <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div class="flex-1 space-y-1">
            <label for="quantity" class="text-base md:text-lg font-medium">
              {{ $t('quantity') }} {{ productBarcode.saleType && `(${productBarcode.saleType})` }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="quantity" type="number" v-model="submitData.quantity"
                   class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
                   :placeholder="t('enterProductQuantity')" />
          </div>
          <div class="flex-1 space-y-1">
            <label for="totalPrice" class="text-base md:text-lg font-medium">
              {{ $t('totalPrice') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <money3 v-model.number="submitData.totalPrice" v-bind="moneyConf" id="totalPrice"
                    class="border-none text-right text-gray-500 bg-slate-100 h-11 rounded-lg w-full text-lg">
            </money3>
          </div>
          <div class="flex-1 space-y-1">
            <label for="count" class="text-base md:text-lg font-medium">
              {{ $t('countOfLabel') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="count" type="number" v-model="submitData.count"
                   class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
                   :placeholder="t('enterProductQuantity')" />
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
      <button v-if="isLoading"
              class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
        {{ $t('create') }}
      </button>
      <button v-else @click="createLabel()" type="button"
              class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('create') }}
      </button>
    </template>
  </CModal>
</template>

<style scoped></style>
