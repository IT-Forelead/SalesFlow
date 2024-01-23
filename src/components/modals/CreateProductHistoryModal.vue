<script setup>
import { ref } from '@vue/reactivity'
import CModal from '../common/CModal.vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import SaveButton from '../buttons/SaveButton.vue'
import AutoComplete from 'primevue/autocomplete'
import { useProductStore } from '../../store/product.store.js'
import { computed, onMounted, reactive } from 'vue'
import ProductService from '../../services/product.service.js'
import ProductHistoryService from '../../services/productHistory.service.js'
import { useProductHistoryStore } from '../../store/productHistory.store.js'

const isLoading = ref(false)
const productStore = useProductStore()

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

const closeModal = () => {
  useModalStore().closeCreateProductHistoriyModal()
  clearSubmitData()
}
const selectedProduct = ref()
const filteredProducts = ref()

const createProductHistory = () => {
  if (!selectedProduct.value?.id) return toast.warning('Iltimos mahsulot tanlang!')
  if (!submitData.quantity) return toast.warning('Iltimos qiymatini kiriting')
  if (!submitData.productHistoryType) return toast.warning('Iltimos mahsulot tarixi turini tanlang')
  if (!submitData.purchasePrice === 0) return toast.warning('Iltimos sotib olingan narxini kiriting')
  if (!submitData.salePrice === 0) return toast.warning('Iltimos sotish narxini kiriting')
  else {
    isLoading.value = true
    ProductHistoryService.createProductHistory({
      productId: selectedProduct.value?.id,
      quantity: submitData.quantity,
      historyType: submitData.productHistoryType,
      purchasePrice: submitData.purchasePrice,
      salePrice: submitData.salePrice,
    }).then(() => {
      toast.success('Mahsulot tarixi muvaffaqiyatli yaratildi!')
      isLoading.value = false
      ProductHistoryService.getProductHistories({})
        .then((res) => {
          useProductHistoryStore().clearStore()
          setTimeout(() => {
            useProductHistoryStore().setProductHistories(res)
          }, 500)
        })
        .catch(() => {
          toast.error('Mahsulot tarixini olishda xatolik yuz berdi!')
        })
      closeModal()
    })
      .catch((err) => {
        toast.error('Mahsulot tarixini yaratishda xatolik yuz berdi!')
        isLoading.value = false
      })
  }
}


const getProducts = () => {
  isLoading.value = true
  ProductService.getProducts({})
    .then((res) => {
      useProductStore().clearStore()
      useProductStore().setProducts(res)
    }).finally(() => {
    isLoading.value = false
  })
}
getProducts()

const search = (event) => {
  const query = event.query.toLowerCase().trim()
  if (!query) {
    filteredProducts.value = [...products.value]
  } else {
    filteredProducts.value = products.value.filter((product) => {
      const barcodeString = product.barcode.toString()
      return (
        product.name.toLowerCase().includes(query) ||
        barcodeString.includes(query)
      )
    })
  }
}

</script>

<template>
  <CModal :is-open="useModalStore().isOpenCreateProductHistoryModal" v-if="useModalStore().isOpenCreateProductHistoryModal"
          @close=closeModal>
    <template v-slot:header>
      Mahsulot tarixi yaratish
    </template>
    <template v-slot:body>
      <div class="p-float-label card p-fluid my-4">
        <AutoComplete
          dropdown
          :dropdown-mode="'current'"
          emptySearchMessage="Mahsulot topilmadi"
          scroll-height="200px"
          v-model="selectedProduct"
          option-label="name"
          :suggestions="filteredProducts"
          @complete="search"
          input-class="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-3" />
        <label for="ac">Mahsulot shtrix kodi yoki nomi bo'yicha izlash...</label>
      </div>

      <div v-if="selectedProduct" class="space-y-4">
        <div class="w-full mb-10">
          <div class="border-b border-gray-200 py-3">
            <p class="text-neutral-800 text-base font-normal">Mahsulot nomi</p>
            <h1 class="text-2xl font-semibold text-neutral-800 mt-2">
              {{ selectedProduct.name }} {{ selectedProduct.packaging }}</h1>
          </div>
          <div class="py-4 border-b border-slate-200 flex items-center justify-between">
            <p class="text-neutral-800 text-base font-normal">Shtrix kod</p>
            <p class="text-sm leading-none text-gray-600 dark:text-gray-300">{{ selectedProduct.barcode }}</p>
          </div>
          <div class="py-4 border-b border-slate-200 flex items-center justify-between">
            <p class="text-neutral-800 text-base font-normal">Miqdori</p>
            <p class="text-sm leading-none text-gray-600 dark:text-gray-300 mr-3">{{ selectedProduct.quantity }}</p>
          </div>
          <div class="py-4 border-b border-slate-200 flex items-center justify-between">
            <p class="text-neutral-800 text-base font-normal">Narxi</p>
            <p class="text-sm leading-none text-gray-600 dark:text-gray-300 mr-3">{{ selectedProduct.price }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1 space-y-1">
            <label for="default-value"
                   class="block mb-2 text-neutral-800 text-base font-normal after:text-red-500 after:content-['*']">
              Miqdori
            </label>
            <input id="default-value" type="text" v-model="submitData.quantity"
                   class="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5"
                   placeholder="Qiymatini kiriting">
          </div>
          <div class="flex-1 space-y-1">
            <label for="product-history-type"
                   class="block mb-2 text-neutral-800 text-base font-normal after:text-red-500 after:content-['*']">
              Mahsulot tarixi turi
            </label>
            <select id="product-history-type" v-model="submitData.productHistoryType"
                    class="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5">
              <option selected>Turini tanlang</option>
              <option value="purchased">Sotib olingan</option>
              <option value="returned">Qaytarilgan</option>
            </select>
          </div>
        </div>
        <div class="flex items-center justify-between space-x-4">
          <div class="flex-1 spaceSearchIcon-y-1">
            <label for="price" class="block mb-2 text-neutral-800 text-base font-normal after:text-red-500 after:content-['*']">
              Sotib olingan narxi
            </label>
            <money3 id="price" v-bind="moneyConf" v-model.number="submitData.purchasePrice"
                    class="bg-slate-50 text-right border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5">
            </money3>
          </div>
          <div class="flex-1 spaceSearchIcon-y-1">
            <label for="price" class="block mb-2 text-neutral-800 text-base font-normal after:text-red-500 after:content-['*']">
              Sotuv narxi
            </label>
            <money3 id="price" v-bind="moneyConf" v-model.number="submitData.salePrice"
                    class="bg-slate-50 text-right border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5">
            </money3>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center border-2 border-dashed h-96 rounded-3xl space-y-1">
        <h4 class="text-slate-900 text-xl font-semibold">
          Mahsulot topilmadi!
        </h4>
        <div class="text-slate-600 text-base text-center">
          Iltimos mahsulot tanlang!
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <SaveButton :isLoading="isLoading" @click="createProductHistory" />
      <CancelButton @click="closeModal" />
    </template>
  </CModal>
</template>
