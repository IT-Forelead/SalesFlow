<script setup>
import CModal from '../common/CModal.vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store.js'
import { useProductStore } from '../../store/product.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import ProductService from '../../services/product.service.js'
import { computed, reactive, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const isLoading = ref(false)
const productStore = useProductStore()

const selectedProduct = computed(() => {
  return productStore.selectedProduct
})

const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

const submitData = reactive({
  id: '',
  name: '',
  barcode: 0,
  packaging: '',
  price: 0,
  saleType: 0,
})

const clearSubmitData = () => {
  submitData.id = ''
  submitData.name = ''
  submitData.barcode = 0
  submitData.packaging = ''
  submitData.price = 0
  submitData.saleType = 0
}

const closeModal = () => {
  useModalStore().closeEditProductModal()
  useProductStore().setSelectedProduct({})
  clearSubmitData()
}

const editProduct = () => {
  if (!submitData.name) {
    toast.error(t('plsEnterProductName'))
  } else if (!submitData.packaging) {
    toast.error(t('plsEnterProductPackaging'))
  } else if (submitData.price === 0) {
    toast.error(t('plsEnterProductPrice'))
  } else if (!submitData.saleType) {
    toast.error(t('plsSelectSaleType'))
  } else {
    isLoading.value = true
    ProductService.updateProduct({
      id: submitData.id,
      name: submitData.name,
      barcode: submitData.barcode,
      packaging: submitData.packaging,
      price: submitData.price,
      saleType: submitData.saleType,
    }).then(() => {
      toast.success(t('productEditedSuccessfully'))
      ProductService.getProducts({})
        .then((res) => {
          productStore.clearStore()
          productStore.setProducts(res.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
      isLoading.value = false
      closeModal()
    })
      .catch((err) => {
        toast.error(t('errorWhileEditingProduct'))
        isLoading.value = false
        closeModal()
      })
  }
}

watch(
  () => selectedProduct.value,
  (data) => {
    if (data) {
      submitData.id = data?.id
      submitData.name = data?.name
      submitData.barcode = data?.barcode
      submitData.packaging = data?.packaging
      submitData.price = data?.price
      submitData.saleType = data?.saleType
    }
  },
  { deep: true }
)
</script>
<template>
  <CModal :is-open="useModalStore().isOpenEditProductModal" v-if="useModalStore().isOpenEditProductModal"
    @close="closeModal">
    <template v-slot:header>
      {{ $t('editProduct') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="name" class="text-base md:text-lg font-medium">
              {{ $t('productName') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="name" type="text" v-model="submitData.name"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterProductName')" />
          </div>
          <div class="flex-1">
            <label for="barcode" class="text-base md:text-lg font-medium">
              {{ $t('barcode') }}
            </label>
            <input id="barcode" type="text" v-model="submitData.barcode"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterProductBarcode')" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="packaging" class="text-base md:text-lg font-medium">
              {{ $t('packaging') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="packaging" type="text" v-model="submitData.packaging"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterProductPackaging')" />
          </div>
          <div class="flex-1">
            <label for="default-type" class="text-base md:text-lg font-medium">
              {{ $t('saleType') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <select id="default-type" v-model="submitData.saleType"
              class="bg-slate-100 border-none text-slate-900 rounded-lg block w-full h-11">
              <option value="" selected>{{ $t('selectType') }}</option>
              <option value="amount">Donali</option>
              <option value="kg">Kilogrammli</option>
              <option value="g">Gramli</option>
              <option value="litre">Litrli</option>
            </select>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="price" class="text-base md:text-lg font-medium">
              {{ $t('price') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <money3 v-model.number="submitData.price" v-bind="moneyConf" id="price"
              class="border-none text-right text-gray-500 bg-slate-100 h-11 rounded-lg w-full text-lg"> </money3>
          </div>
          <div class="flex-1"></div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
      <button v-if="isLoading" type="button"
        class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
        {{ $t('save') }}
      </button>
      <button v-else @click="editProduct()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('save') }}
      </button>
    </template>
  </CModal>
</template>
