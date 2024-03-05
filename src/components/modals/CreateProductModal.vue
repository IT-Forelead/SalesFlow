<script setup>
import { cleanObjectEmptyFields } from '../../mixins/utils'
import CModal from '../common/CModal.vue'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import { useModalStore } from '../../store/modal.store'
import { useProductStore } from '../../store/product.store'
import { useBarcodeStore } from '../../store/barcode.store'
import CancelButton from '../buttons/CancelButton.vue'
import SearchIcon from '../../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import BarcodeIcon from '../../assets/icons/BarcodeIcon.vue'
import ProductService from '../../services/product.service'
import { reactive, ref, watch, watchEffect } from 'vue'
import { computed } from 'vue'
import { isBarcode } from '../../mixins/barcodeFormatter'
import ImageIcon from '../../assets/icons/ImageIcon.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const barcodeStore = useBarcodeStore()

const decodedBarcode = computed(() => {
  return barcodeStore.decodedBarcode
})

const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

const isLoading = ref(false)
const isSearching = ref(false)
const searchProductBarcode = ref('')
const productBarcode = ref({})
const productBarcodes = ref([])

const submitData = reactive({
  name: '',
  barcode: '',
  packaging: '',
  saleType: '',
  price: 0,
  quantity: 0,
})

const clearSubmitData = () => {
  submitData.name = ''
  submitData.barcode = ''
  submitData.packaging = ''
  submitData.saleType = ''
  submitData.price = 0
  submitData.quantity = 0
}

const closeModal = () => {
  useModalStore().closeCreateProductModal()
  clearSubmitData()
}

const createProduct = () => {
  if (!submitData.name) {
    toast.error(t('plsEnterProductName'))
  } else if (submitData.barcode && !isBarcode(submitData.barcode)) {
    toast.error(t('barcodeIsInvalid'))
  } else if (!submitData.packaging) {
    toast.error(t('plsEnterProductPackaging'))
  } else if (!submitData.saleType) {
    toast.error(t('plsSelectSaleType'))
  } else if (submitData.quantity <= 0) {
    toast.error(t('plsEnterProductQuantity'))
  } else if (submitData.price <= 0) {
    toast.error(t('plsEnterProductPrice'))
  } else {
    isLoading.value = true
    ProductService.createProduct(
      cleanObjectEmptyFields({
        name: submitData.name,
        barcode: submitData.barcode,
        packaging: submitData.packaging,
        saleType: submitData.saleType,
        price: submitData.price,
        quantity: submitData.quantity,
      })
    ).then(() => {
      toast.success(t('productAddedSuccessfully'))
      ProductService.getProducts({})
        .then((res) => {
          useProductStore().clearStore()
          useProductStore().total = res.total
          useProductStore().setProducts(res.data.reverse())
        })
      isLoading.value = false
      closeModal()
    }).catch((err) => {
      toast.error(t('errorWhileCreatingProduct'))
      setTimeout(() => {
        isLoading.value = false
      }, 3000)
    })
  }
}

const searchProductBarcodes = () => {
  if (!searchProductBarcode.value) {
    toast.error(t('plsEnterProductNameOrBarcode'))
  } else {
    isSearching.value = true
    if (isBarcode(searchProductBarcode.value)) {
      ProductService.getBarcodeProductByFilter(
        cleanObjectEmptyFields({
          barcode: searchProductBarcode.value
        })
      ).then((res) => {
        if (res.length == 0) {
          toast.error(t('thereIsNoSuchBarcodeProduct'))
          clearSubmitData()
          submitData.barcode = searchProductBarcode.value
        } else if (res.length == 1) {
          useBarcodeStore().setDecodedBarcode('')
          productBarcode.value = res[0]
        } else {
          useBarcodeStore().setDecodedBarcode('')
          productBarcodes.value = res
        }
        isSearching.value = false
        searchProductBarcode.value = ''
      }).catch((err) => {
        toast.error(t('errorGettingProduct'))
        setTimeout(() => {
          isSearching.value = false
        }, 3000)
      })
    } else {
      ProductService.getBarcodeProductByFilter(
        cleanObjectEmptyFields({
          name: searchProductBarcode.value
        })
      ).then((res) => {
        if (res.length == 0) {
          toast.error(t('thereIsNoSuchBarcodeProduct'))
          clearSubmitData()
        } else if (res.length == 1) {
          productBarcode.value = res[0]
        } else {
          productBarcodes.value = res
        }
        isSearching.value = false
        searchProductBarcode.value = ''
      }).catch((err) => {
        toast.error(t('errorGettingProduct'))
        setTimeout(() => {
          isSearching.value = false
        }, 3000)
      })
    }
  }
}

const selectedProductBarcode = (product) => {
  productBarcode.value = product
  productBarcodes.value = []
}

const whenPressEnter = (e) => {
  if (e.keyCode === 13) {
    searchProductBarcodes()
  }
}

const onSearchFocus = ref(null)

watchEffect(() => {
  if (onSearchFocus.value) {
    onSearchFocus.value.focus()
  }
})

watch(
  () => productBarcode.value,
  (data) => {
    if (data) {
      submitData.barcode = data?.barcode
      submitData.name = data?.trademark
      submitData.packaging = data?.packaging
      submitData.saleType = data?.saleType
    }
  },
  { deep: true }
)

watch(
  () => decodedBarcode.value,
  (data) => {
    if (data && router?.currentRoute?.value?.path === '/products') {
      searchProductBarcode.value = data
      searchProductBarcodes()
    }
  },
  { deep: true }
)
</script>

<template>
  <CModal :is-open="useModalStore().isOpenCreateProductModal" v-if="useModalStore().isOpenCreateProductModal"
    @close=closeModal>
    <template v-slot:header>
      {{ $t('createProduct') }}
    </template>
    <template v-slot:body>
      <div class="relative mb-8">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400" />
        </div>
        <input type="search" v-model="searchProductBarcode" ref="onSearchFocus" v-on:keypress="whenPressEnter($event)"
          class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-12 pl-10 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
          :placeholder="t('searchByProductNameOrBarcode')">
        <div class="absolute inset-y-0 right-0 flex items-center space-x-2">
          <div @click="useModalStore().openCameraScannerModal()"
            class="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white cursor-pointer">
            <BarcodeIcon class="w-6 h-6 text-slate-900" />
          </div>
          <button type="button" @click="searchProductBarcodes()"
            class="px-4 bg-[#0167F3] text-white rounded-lg text-base h-full md:text-lg cursor-pointer">
            {{ $t('search') }}
          </button>
        </div>
        <div v-if="productBarcodes.length > 0" class="absolute top-16 left-0 bg-transparent w-full space-y-2 z-[2000]">
          <div v-for="(product, idx) in productBarcodes" :key="idx" @click="selectedProductBarcode(product)"
            class="flex items-center justify-between bg-white border shadow-sm rounded-xl px-3 py-2 w-full cursor-pointer hover:bg-slate-100">
            <div class="flex items-center space-x-3">
              <div class="flex items-center justify-center bg-slate-200 w-10 h-10 rounded-lg">
                <ImageIcon class="text-gray-500 w-8 h-8" />
              </div>
              <div>
                <div class="text-base font-semibold text-gray-800">
                  {{ product?.trademark + " - " + product?.packaging }}
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
        </div>
      </div>
      <div class="space-y-2 md:space-y-4">
        <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div class="flex-1">
            <label for="name" class="text-base md:text-lg font-medium">
              {{ $t('productName') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="name" type="text" v-model="submitData.name"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
              :placeholder="t('enterProductName')">
          </div>
          <div class="flex-1">
            <label for="barcode" class="text-base md:text-lg font-medium">
              {{ $t('barcode') }}
            </label>
            <input id="barcode" type="text" v-model="submitData.barcode"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
              :placeholder="t('enterProductBarcode')">
          </div>
        </div>
        <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div class="flex-1 space-y-1">
            <label for="default-value" class="text-base md:text-lg font-medium">
              {{ $t('packaging') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="default-value" type="text" v-model="submitData.packaging"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
              :placeholder="t('enterProductPackaging')">
          </div>
          <div class="flex-1 space-y-1">
            <label for="default-type" class="text-base md:text-lg font-medium">
              {{ $t('saleType') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <select id="default-type" v-model="submitData.saleType"
              class="bg-slate-100 border-none text-slate-900 rounded-lg text-base md:text-lg block w-full h-11">
              <option value="" selected>{{ $t('selectType') }}</option>
              <option value="amount">Donali</option>
              <option value="kg">Kilogrammli</option>
              <option value="g">Gramli</option>
              <option value="litre">Litrli</option>
            </select>
          </div>
        </div>
        <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div class="flex-1 space-y-1">
            <label for="quantity" class="text-base md:text-lg font-medium">
              {{ $t('quantity') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="quantity" type="text" v-model="submitData.quantity"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
              :placeholder="t('enterProductQuantity')">
          </div>
          <div class="flex-1 spaceSearchIcon-y-1">
            <label for="price" class="text-base md:text-lg font-medium">
              {{ $t('price') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <money3 v-model.number="submitData.price" v-bind="moneyConf" id="price"
              class="border-none text-right text-gray-500 bg-slate-100 h-11 rounded-lg w-full text-lg">
            </money3>
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
      <button v-else @click="createProduct()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('create') }}
      </button>
    </template>
  </CModal>
</template>

<style scoped></style>