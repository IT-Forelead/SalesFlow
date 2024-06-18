<script setup>
import CModal from '../common/CModal.vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store.js'
import { useProductStore } from '../../store/product.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import ProductService from '../../services/product.service.js'
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import ImageIcon from '../../assets/icons/ImageIcon.vue'

const { t } = useI18n()
const route = useRoute()
const productStore = useProductStore()

const isLoading = ref(false)
const selectedImage = ref('')

const selectedProduct = computed(() => {
  return productStore.selectedProduct
})

const currentPage = computed(() => {
  return productStore.currentPage
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
  saleType: 0,
  image: null,
  assetId: null,
})

const clearSubmitData = () => {
  submitData.id = ''
  submitData.name = ''
  submitData.barcode = 0
  submitData.packaging = ''
  submitData.saleType = 0
  submitData.image = null
  submitData.assetId = null
}

const closeModal = () => {
  useModalStore().closeEditProductModal()
  useProductStore().setSelectedProduct({})
  clearSubmitData()
}

const updateProduct = () => {
  ProductService.updateProduct({
    id: submitData.id,
    name: submitData.name,
    assetId: submitData.assetId,
    barcode: submitData.barcode,
    packaging: submitData.packaging,
    saleType: submitData.saleType,
  }).then(() => {
    toast.success(t('productEditedSuccessfully'))
    ProductService.getProducts({ limit: 30, page: currentPage.value, name: route.query.search })
      .then((res) => {
        productStore.clearStore()
        productStore.setProducts(res.data)
      })
      .catch((err) => {
        toast.error(err.message)
      })
    isLoading.value = false
    closeModal()
  }).catch((err) => {
    console.log(err);
    if (err.response.data.includes("already exist")) {
      toast.error(t('thisProductNameAlreadyExist'))
    } else {
      toast.error(t('errorWhileEditingProduct'))
    }
    isLoading.value = false
  })
}

const editProduct = () => {
  if (!submitData.name) {
    toast.warning(t('plsEnterProductName'))
  } else if (!submitData.packaging) {
    toast.warning(t('plsEnterProductPackaging'))
  } else if (submitData.price === 0) {
    toast.warning(t('plsEnterProductPrice'))
  } else if (!submitData.saleType) {
    toast.warning(t('plsSelectSaleType'))
  } else {
    isLoading.value = true
    const formData = new FormData()
    if (submitData.image) {
      formData.append('image', submitData.image)
      ProductService.uploadImage(formData)
        .then((res) => {
          submitData.assetId = res
          updateProduct()
        })
        .catch((err) => {
          toast.error(t('thereWasAnErrorUploadingThePhoto'))
          isLoading.value = false
        })
    } else updateProduct()
  }
}

function getImage(e) {
  if (e.target.files[0].type.includes('image')) {
    submitData.image = e.target.files[0]
    selectedImage.value = URL.createObjectURL(submitData.image)
  } else toast.warning(t('youCanOnlyUploadPicture'))
}

watch(
  () => selectedProduct.value,
  (data) => {
    if (data) {
      submitData.id = data?.id
      submitData.name = data?.name
      submitData.barcode = data?.barcode
      submitData.packaging = data?.packaging
      submitData.saleType = data?.saleType
      submitData.assetId = data?.assetId
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
        <div class="flex flex-col p-5 mb-12">
          <label v-if="!submitData.image" for="dropzone-file"
            class="relative flex items-center justify-center w-28 h-28 max-w-lg p-6 mx-auto text-center border-2 border-blue-400 border-dashed rounded-lg cursor-pointer bg-slate-100">
            <ImageIcon class="w-12 h-12 text-blue-700" />
            <input id="dropzone-file" type="file" class="hidden" name="image" @change="getImage" />
            <span
              class="absolute mx-auto mt-3 text-lg font-semibold tracking-wide text-blue-500 -bottom-10 whitespace-nowrap">
              {{ $t('uploadPhoto') }}
            </span>
          </label>
          <label v-else for="dropzone-file"
            class="relative flex items-center justify-center w-28 h-28 max-w-lg mx-auto text-center border-2 rounded-lg cursor-pointer">
            <img :src="selectedImage" class="object-cover w-28 h-28 rounded-lg" alt="#" />
            <input id="dropzone-file" type="file" class="hidden" name="image" @change="getImage" />
            <span
              class="absolute mx-auto mt-3 text-lg font-semibold tracking-wide text-blue-500 -bottom-10 whitespace-nowrap">
              {{ $t('uploadAnotherPhoto') }}
            </span>
          </label>
        </div>
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
