<script setup>
import CModal from '../common/CModal.vue'
import { vMaska } from 'maska'
import { computed, reactive, ref, watch, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store'
import { useProductStore } from '../../store/product.store'
import CancelButton from '../buttons/CancelButton.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import ProductService from '../../services/product.service'
import CategoryService from '../../services/category.service'
import { useCategoryStore } from '../../store/category.store'
import { isBarcode, isBarcodeType } from '../../mixins/barcodeFormatter'
import { useI18n } from 'vue-i18n'
import { cleanObjectEmptyFields } from '../../mixins/utils'

const { t } = useI18n()

const isLoading = ref(false)
const productStore = useProductStore()
const selectedBarcodes = computed(() => {
  return productStore.selectedBarcodes
})

const submitData = reactive({
  type: '',
  subType: '',
  name: '',
  trademark: '',
  packaging: '',
  typeCode: '',
  barcode: '',
  reg_number: 0,
  saleType: '',
  year: '',
  categoryId: ''
})

const clearSubmitData = () => {
  submitData.type = ''
  submitData.subType = ''
  submitData.name = ''
  submitData.trademark = ''
  submitData.packaging = ''
  submitData.typeCode = ''
  submitData.barcode = ''
  submitData.reg_number = 0
  submitData.saleType = ''
  submitData.year = ''
  submitData.categoryId = ''
}

const closeModal = () => {
  useModalStore().closeEditProductBarcodeModal()
  useProductStore().setSelectedBarcodes({})
  clearSubmitData()
}

const updateProductBarcode = () => {
  if (!submitData.trademark) {
    toast.warning(t('plsEnterProductName'))
  } else if (!submitData.packaging) {
    toast.warning(t('plsEnterProductPackaging'))
  } else if (!submitData.barcode) {
    toast.warning(t('plsEnterProductBarcode'))
  } else if (submitData.barcode && !isBarcode(submitData.barcode)) {
    toast.warning(t('barcodeIsInvalid'))
  } else if (!submitData.saleType) {
    toast.warning(t('plsSelectSaleType'))
  } else {
    isLoading.value = true
    ProductService.updateProductBarcode(
      cleanObjectEmptyFields({
        id: submitData.id,
        type: submitData.type,
        subType: submitData.subType,
        name: submitData.name,
        trademark: submitData.trademark,
        packaging: submitData.packaging,
        typeCode: isBarcodeType(submitData.barcode),
        barcode: submitData.barcode,
        regNumber: submitData.reg_number,
        saleType: submitData.saleType,
        year: submitData.year,
        categoryId: submitData.categoryId
      })
    ).then(() => {
      CategoryService.joinCategory({
        barcodeId: submitData.id,
        categoryId: submitData.categoryId
      })
      toast.success(t('productBarcodeEditedSuccessfully'))
      ProductService.getBarcodes(30, 1)
        .then((res) => {
          useProductStore().clearStore()
          useProductStore().setProductBarcodes(res.data)
        })
      isLoading.value = false
      closeModal()
    }).catch((err) => {
      toast.success(t('errorWhileEditingProductBarcode'))
      setTimeout(() => {
        isLoading.value = false
      }, 3000)
    })
  }
}

watch(
  () => selectedBarcodes.value,
  (data) => {
    if (data) {
      submitData.id = data?.id
      submitData.subType = data?.subType
      submitData.name = data?.name
      submitData.trademark = data?.trademark
      submitData.packaging = data?.packaging
      submitData.typeCode = data?.typeCode
      submitData.barcode = data?.barcode
      submitData.reg_number = data?.reg_number
      submitData.saleType = data?.saleType
      submitData.year = data?.year
      submitData.categoryId = data?.categoryId
    }
  }
)

onMounted(() => {
  getCategories();
});

const getCategories = async () => {
  const res = await CategoryService.getCategories();
  useCategoryStore().clearStore();
  useCategoryStore().setCategories(res);
};
</script>

<template>
  <CModal :is-open="useModalStore().isOpenEditProductBarcodeModal" v-if="useModalStore().isOpenEditProductBarcodeModal"
    @close="closeModal">
    <template v-slot:header>
      {{ $t('editProductBarcode') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="trademark" class="text-base dark:text-white font-medium">
              {{ $t('productName') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="trademark" type="text" v-model="submitData.trademark"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterProductName')" />
          </div>
          <div class="flex-1">
            <label for="packaging" class="text-base dark:text-white font-medium">
              {{ $t('packaging') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="packaging" type="text" v-model="submitData.packaging"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterProductPackaging')" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="barcode" class="text-base dark:text-white font-medium">
              {{ $t('barcode') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="barcode" type="text" v-model="submitData.barcode"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterProductBarcode')" />
          </div>
          <div class="flex-1">
            <label for="sale-type" class="text-base dark:text-white font-medium">
              {{ $t('saleType') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <select id="sale-type" v-model="submitData.saleType"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg block w-full h-11">
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
            <label for="barcode" class="text-base dark:text-white font-medium">
              {{ $t('inYearOfRegistration') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="barcode" type="text" v-model="submitData.year" v-maska data-maska="####"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('forExample2017')" />
          </div>
          <div class="flex-1">
            <label for="sale-type" class="text-base dark:text-white font-medium">
              {{ $t('categoryType') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <select id="sale-type" v-model="submitData.categoryId"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg block w-full h-11">
              <option value="" disabled selected>{{ $t('selectCategory') }}</option>
              <option v-for="(category, idx) in useCategoryStore().categories" :key="idx" :value="category?.id">
                {{ category?.name }}
              </option>
            </select>
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
        {{ $t('save') }}
      </button>
      <button v-else @click="updateProductBarcode()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('save') }}
      </button>
    </template>
  </CModal>
</template>
<style scoped></style>