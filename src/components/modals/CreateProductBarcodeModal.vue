<script setup>
import CModal from '../common/CModal.vue'
import { vMaska } from 'maska'
import { reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store'
import { useProductStore } from '../../store/product.store'
import CancelButton from '../buttons/CancelButton.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import ProductService from '../../services/product.service'
import { isBarcode, isBarcodeType } from '../../mixins/barcodeFormatter'
import BarcodeIcon from '../../assets/icons/BarcodeIcon.vue'
import { useBarcodeStore } from '../../store/barcode.store'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { cleanObjectEmptyFields } from '../../mixins/utils'

const { t } = useI18n()

const isLoading = ref(false)

const submitData = reactive({
  trademark: '',
  packaging: '',
  barcode: '',
  saleType: '',
  year: '',
})

const clearSubmitData = () => {
  submitData.trademark = ''
  submitData.packaging = ''
  submitData.barcode = ''
  submitData.saleType = ''
  submitData.year = ''
}

const closeModal = () => {
  useModalStore().closeCreateProductBarcodeModal()
  clearSubmitData()
}

const createProductBarcode = () => {
  if (!submitData.trademark) {
    toast.warning(t('plsEnterProductName'))
  } else if (!submitData.packaging) {
    toast.warning(t('plsEnterProductPackaging'))
  } else if (!submitData.barcode) {
    toast.warning(t('plsEnterProductBarcode'))
  } else if (submitData.barcode.trim() && !isBarcode(submitData.barcode.trim())) {
    toast.warning(t('barcodeIsInvalid'))
  } else {
    isLoading.value = true
    ProductService.createProductBarcode(
      cleanObjectEmptyFields({
        trademark: submitData.trademark,
        packaging: submitData.packaging,
        typeCode: isBarcodeType(submitData.barcode.trim()),
        barcode: submitData.barcode.trim(),
        saleType: submitData.saleType,
        year: submitData.year
      })
    ).then(() => {
      toast.success(t('barcodeAddedSuccessfully'))
      ProductService.getBarcodes(30, 1)
        .then((res) => {
          useProductStore().clearStore()
          useProductStore().barcodesTotal = res.total
          useProductStore().setProductBarcodes(res.data)
        })
      isLoading.value = false
      closeModal()
    }).catch((err) => {
      toast.error(t('errorWhileCreatingBarcode'))
      setTimeout(() => {
        isLoading.value = false
      }, 3000)
    })
  }
}

watch(
  () => useBarcodeStore().decodedBarcode,
  (data) => {
    if (data) {
      submitData.barcode = data
    }
  },
  { deep: true }
)
</script>

<template>
  <CModal :is-open="useModalStore().isOpenCreateProductBarcodeModal"
    v-if="useModalStore().isOpenCreateProductBarcodeModal" @close="closeModal">
    <template v-slot:header>
      {{ $t('createBarcode') }}
    </template>
    <template v-slot:body>
      <div class="space-y-2 md:space-y-4">
        <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div class="flex-1">
            <label for="trademark" class="text-base dark:text-white font-medium">
              {{ $t('productName') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="trademark" type="text" v-model="submitData.trademark"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterProductName')" />
          </div>
          <div class="flex-1">
            <label for="packaging" class="text-base dark:text-white font-medium">
              {{ $t('packaging') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="packaging" type="text" v-model="submitData.packaging"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterProductPackaging')" />
          </div>
        </div>
        <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div class="flex-1">
            <label for="barcode" class="text-base dark:text-white font-medium">
              {{ $t('barcode') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <div class="relative">
              <input id="barcode" type="text" v-model="submitData.barcode"
                class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                :placeholder="t('enterProductBarcode')" />
              <div @click="useModalStore().openCameraScannerModal()"
                class="absolute top-1/2 -translate-y-1/2 right-1 flex items-center justify-center w-8 h-8 rounded-lg hover:dark:bg-slate-600 cursor-pointer">
                <BarcodeIcon class="w-6 h-6 text-slate-900 dark:text-white" />
              </div>
            </div>
          </div>
          <div class="flex-1">
            <label for="sale-type" class="text-base dark:text-white font-medium">
              {{ $t('saleType') }}
            </label>
            <select id="sale-type" v-model="submitData.saleType"
              class="bg-slate-100 border-none text-slate-900 rounded-lg block w-full h-11">
              <option value="" selected>{{ $t('selectType') }}</option>
              <option value="amount">Donali</option>
              <option value="kg">Kilogrammli</option>
              <option value="g">Gramli</option>
              <option value="litre">Litrli</option>
            </select>
          </div>
        </div>
        <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div class="flex-1">
            <label for="barcode" class="text-base dark:text-white font-medium">
              {{ $t('inYearOfRegistration') }}
            </label>
            <input id="barcode" type="text" v-model="submitData.year" v-maska data-maska="####"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('forExample2017')" />
          </div>
          <div class="flex-1"></div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
      <button v-if="isLoading" type="bSearchIconutton"
        class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-white fill-gray-600 dark:fill-gray-300" />
        {{ $t('create') }}
      </button>
      <button v-else @click="createProductBarcode()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('create') }}
      </button>
    </template>
  </CModal>
</template>

<style scoped></style>