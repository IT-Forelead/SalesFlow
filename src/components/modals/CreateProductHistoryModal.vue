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

watchEffect(() => {
  if (useModalStore().isOpenCreateProductHistoryModal === true) {
    getProducts()
  }
})

const searchResults = computed(() => {
  if (search.value === '') {
    return [];
  }
  const searchString = search.value.toLowerCase();
  return products.value.filter(item => {
    const barcodeString = item.barcode.toString();
    return (
      item.name.toLowerCase().includes(searchString) ||
      barcodeString.includes(searchString)
    );
  });
});
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
  <CModal :is-open="useModalStore().isOpenCreateProductHistoryModal" v-if="useModalStore().isOpenCreateProductHistoryModal"
          @close=closeModal>
    <template v-slot:header>
      Mahsulot tarixi yaratish
    </template>
    <template v-slot:body>
      <div class="w-full relative mb-4">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400" />
        </div>
        <input
          type="text"
          v-model="search"
          placeholder="Mahsulot nomi va shtrix kodini kiriting"
          class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-12 pl-10 placeholder-slate-400"
          @input="isOpen = true"
        >
        <ul
          v-if="searchResults.length && isOpen"
          class="mt-1 w-full max-h-60 overflow-y-auto absolute z-10 bg-white border border-slate-200 rounded-xl shadow-md">
          <li
            class="px-4 py-3 border-b border-slate-200 cursor-pointer hover:bg-slate-100"
            v-for="result in searchResults"
            :key="result.id"
            @click="setSelectedProduct(result)"
          >
            <span class="font-semibold">{{ result.name }}</span> - {{ result.packaging }}
          </li>
        </ul>
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
            <p class="text-sm leading-none text-gray-600">{{ selectedProduct.barcode }}</p>
          </div>
          <div class="py-4 border-b border-slate-200 flex items-center justify-between">
            <p class="text-neutral-800 text-base font-normal">Miqdori</p>
            <p class="text-sm leading-none text-gray-600 mr-3">{{ selectedProduct.quantity }}</p>
          </div>
          <div class="py-4 border-b border-slate-200 flex items-center justify-between">
            <p class="text-neutral-800 text-base font-normal">Narxi</p>
            <p class="text-sm leading-none text-gray-600 mr-3">{{ useMoneyFormatter(selectedProduct.price) }}</p>
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
