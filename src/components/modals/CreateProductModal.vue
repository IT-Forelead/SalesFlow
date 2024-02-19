<script setup>
import { cleanObjectEmptyFields } from '../../mixins/utils'
import CModal from '../common/CModal.vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store'
import { useProductStore } from '../../store/product.store'
import CancelButton from '../buttons/CancelButton.vue'
import SearchIcon from '../../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import CameraIcon from '../../assets/icons/CameraIcon.vue'
import ProductService from '../../services/product.service'
import { reactive, ref, watch, watchEffect } from 'vue'


const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

const isLoading = ref(false)
const isSearching = ref(false)
const searchBarcodeProduct = ref('')
const barcodeProduct = ref({})

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
    toast.error('Mahsulot nomini kiriting!')
  } else if (!submitData.packaging) {
    toast.error('Mahsulot qadoqi haqida ma\'lumot kiriting!')
  } else if (!submitData.saleType) {
    toast.error('Mahsulot Sotuv turini tanlang!')
  } else if (submitData.price === 0) {
    toast.error('Mahsulot narxini kiriting!')
  } else if (submitData.quantity === 0) {
    toast.error('Mahsulot miqdorini kiriting!')
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
      toast.success('Mahsulot muoffaqiyatli qo\'shildi!')
      ProductService.getProducts({})
        .then((res) => {
          useProductStore().clearStore()
          useProductStore().setProducts(res.reverse())
        })
      isLoading.value = false
      closeModal()
    }).catch((err) => {
      toast.error('Mahsulot yaratishda xatolik yuz berdi!')
      setTimeout(() => {
        isLoading.value = false
      }, 3000)
    })
  }
}

const searchProductByBarcode = () => {
  if (!searchBarcodeProduct.value) {
    toast.error('Shtrix kodni kiriting!')
  } else {
    isSearching.value = true
    ProductService.getBarcodeProduct(searchBarcodeProduct.value)
      .then((res) => {
        barcodeProduct.value = res
        isSearching.value = false
        searchBarcodeProduct.value = ''
      }).catch((err) => {
        toast.error('Bunday shtrix kodli mahsulot mavjud emas!')
        setTimeout(() => {
          searchBarcodeProduct.value = false
        }, 3000)
      })
  }
}

const whenPressEnter = (e) => {
  if (e.keyCode === 13) {
    searchProductByBarcode()
  }
}

const onSearchFocus = ref(null)

watchEffect(() => {
  if (onSearchFocus.value) {
    onSearchFocus.value.focus()
  }
})

watch(
  () => barcodeProduct.value,
  (data) => {
    if (data) {
      submitData.barcode = data?.barcode
      submitData.name = data?.trademark
      submitData.packaging = data?.packaging
    }
  },
)

</script>

<template>
  <CModal :is-open="useModalStore().isOpenCreateProductModal" v-if="useModalStore().isOpenCreateProductModal"
    @close=closeModal>
    <template v-slot:header>
      Mahsulot yaratish
    </template>
    <template v-slot:body>
      <div class="relative mb-8">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400" />
        </div>
        <input type="search" v-model="searchBarcodeProduct" ref="onSearchFocus" v-on:keypress="whenPressEnter($event)"
          class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-12 pl-10 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
          placeholder="Mahsulotni shtrix kodi orqali izlash...">
        <div class="absolute inset-y-0 right-0 flex items-center space-x-2">
          <div @click="useModalStore().openCameraScannerModal()"
            class="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white cursor-pointer">
            <CameraIcon class="w-6 h-6 text-slate-400" />
          </div>
          <button type="button" @click="searchProductByBarcode()"
            class="px-4 bg-[#0167F3] text-white rounded-lg text-base h-full md:text-lg cursor-pointer">
            Izlash
          </button>
        </div>
      </div>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="name" class="text-base md:text-lg font-medium">
              Mahsulot nomi
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="name" type="text" v-model="submitData.name"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
              placeholder="Mahsulot nomini kiriting">
          </div>
          <div class="flex-1">
            <label for="barcode" class="text-base md:text-lg font-medium">
              Shtrix kodi
            </label>
            <input id="barcode" type="text" v-model="submitData.barcode"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
              placeholder="Shtrix kodini kiriting">
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1 space-y-1">
            <label for="default-value" class="text-base md:text-lg font-medium">
              Qadoqi
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="default-value" type="text" v-model="submitData.packaging"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
              placeholder="Qadoqi haqida ma'lumot kiriting">
          </div>
          <div class="flex-1 space-y-1">
            <label for="default-type" class="text-base md:text-lg font-medium">
              Sotuv turi
              <span class="text-red-500 mr-2">*</span>
            </label>
            <select id="default-type" v-model="submitData.saleType"
              class="bg-slate-100 border-none text-slate-900 rounded-lg text-base md:text-lg block w-full h-11">
              <option value="" selected>Turini tanlang</option>
              <option value="amount">Donali</option>
              <option value="kg">Kilogrammli</option>
              <option value="g">Gramli</option>
              <option value="litre">Litrli</option>
            </select>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1 space-y-1">
            <label for="quantity" class="text-base md:text-lg font-medium">
              Miqdori
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="quantity" type="text" v-model="submitData.quantity"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
              placeholder="Mahsulot miqdorini kiriting">
          </div>
          <div class="flex-1 spaceSearchIcon-y-1">
            <label for="price" class="text-base md:text-lg font-medium">
              Narxi
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
        Yaratish
      </button>
      <button v-else @click="createProduct()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        Yaratish
      </button>
    </template>
  </CModal>
</template>

<style scoped></style>