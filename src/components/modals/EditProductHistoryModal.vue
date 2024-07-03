<script setup>
import CModal from '../common/CModal.vue'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import { computed, reactive, ref, watch } from 'vue'
import { useProductHistoryStore } from '../../store/productHistory.store.js'
import { useI18n } from 'vue-i18n'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import { toast } from 'vue-sonner'
import ProductHistoryService from '../../services/productHistory.service.js'
import ProductService from '../../services/product.service.js'
import { useRoute } from 'vue-router'
import { calcPercentOfSale } from '../../mixins/utils'
import moment from 'moment'

const route = useRoute()
const { t } = useI18n()
const isLoading = ref(false)
const productHistoryStore = useProductHistoryStore()
const selectedProductHistory = computed(() => {
  return productHistoryStore.selectedProductHistory
})
const currentPage = computed(() => {
  return productHistoryStore.currentPage
})

const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

const submitData = reactive({
  id: '',
  productName: '',
  productPackaging: '',
  productSaleType: '',
  quantity: 0,
  purchasePrice: 0,
  productionDate: '',
  expirationDate: '',
  toLend: false,
  salePrice: 0,
  sold: 0,
})

const clearSubmitData = () => {
  submitData.id = ''
  submitData.productName = ''
  submitData.productPackaging = ''
  submitData.productSaleType = ''
  submitData.purchasePrice = 0
  submitData.quantity = 0
  submitData.productionDate = ''
  submitData.expirationDate = ''
  submitData.salePrice = 0
  submitData.toLend = false
}

const editProductHistory = () => {
  if (!submitData.purchasePrice) {
    toast.warning(t('plsEnterPurchasePrice'))
  } else if (!submitData.quantity) {
    toast.warning(t('plsEnterQuantity'))
  } else if (submitData.quantity < 0) {
    toast.warning(t('quantityCantBeNegative'))
  } else if (submitData.quantity < submitData.sold) {
    toast.warning(t('quantityCantBeLess'))
  } else {
    isLoading.value = true
    ProductHistoryService.updateProductHistory({
      id: submitData.id,
      productName: submitData.productName,
      productPackaging: submitData.productPackaging,
      productSaleType: submitData.productSaleType,
      purchasePrice: submitData.purchasePrice,
      salePrice: submitData.salePrice,
      quantity: submitData.quantity,
      productionDate: submitData.productionDate,
      expirationDate: submitData.expirationDate,
      toLend: submitData.toLend,
    }).then(() => {
      toast.success(t('productEditedSuccessfully'))
      ProductService.getProductsDetails({ limit: 30, page: currentPage.value, name: route.query.search })
        .then((res) => {
          productHistoryStore.clearStore()
          useProductHistoryStore().totalHistories = res.total
          productHistoryStore.setProductHistories(res.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
      isLoading.value = false
      closeModal()
    })
      .catch(() => {
        toast.error(t('errorWhileEditingProduct'))
        isLoading.value = false
        closeModal()
      })
  }
}

watch(
  () => selectedProductHistory.value,
  (data) => {
    if (data) {
      submitData.id = data?.id
      submitData.productName = data?.name
      submitData.productPackaging = data?.packaging
      submitData.productSaleType = data?.saleType
      submitData.quantity = data?.quantity
      submitData.purchasePrice = data?.purchasePrice
      submitData.productionDate = data?.productionDate
      submitData.expirationDate = data?.expirationDate
      submitData.toLend = data?.toLend
      submitData.salePrice = data?.price
      submitData.sold = data?.sold
    }
  },
  { deep: true },
)

const closeModal = () => {
  useModalStore().closeEditProductHistoryModal()
  useProductHistoryStore().setSelectedProductHistory({})
  clearSubmitData()
}

const calculateExpirationDate = (months) => {
  const newDate = moment(submitData.productionDate, 'YYYY-MM-DD').add(months, 'months')
  submitData.expirationDate = newDate.format('YYYY-MM-DD')
}
</script>

<template>
  <CModal :is-open="useModalStore().isOpenEditProductHistoryModal" v-if="useModalStore().isOpenEditProductHistoryModal"
    @close=closeModal>
    <template v-slot:header>
      {{ $t('editProductHistory') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1 space-y-1">
            <label for="name" class="text-base md:text-lg font-medium">
              {{ $t('productName') }}
            </label>
            <input id="name" type="text" v-model="submitData.productName"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
              :placeholder="t('enterProductName')">
          </div>
          <div class="flex-1 space-y-1">
            <label for="default-value" class="text-base md:text-lg font-medium">
              {{ $t('packaging') }}
            </label>
            <input id="default-value" type="text" v-model="submitData.productPackaging"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
              :placeholder="t('enterProductPackaging')">
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1 space-y-1">
            <label for="price" class="block text-left mb-2 text-slate-900 text-base font-medium after:text-red-500 ">
              {{ $t('purchasePrice') }}
            </label>
            <money3 id="price" v-bind="moneyConf" v-model.number="submitData.purchasePrice"
              class="bg-slate-50 text-right border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5">
            </money3>
          </div>
          <div class="flex-1 space-y-1">
            <label for="price" class="block text-left mb-2 text-slate-900 text-base font-medium after:text-red-500 ">
              {{ $t('salePrice') }}
            </label>
            <money3 id="price" v-bind="moneyConf" v-model.number="submitData.salePrice"
              class="bg-slate-50 text-right border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5">
            </money3>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1 space-y-1">
            <label for="quantity" class="text-base md:text-lg font-medium">
              {{ $t('quantity') }}
            </label>
            <input id="quantity" type="text" v-model="submitData.quantity"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
              :placeholder="t('enterProductQuantity')">
          </div>
          <div class="flex-1 space-y-1">
            <label for="default-type" class="text-base md:text-lg font-medium">
              {{ $t('saleType') }}
            </label>
            <select id="default-type" v-model="submitData.productSaleType"
              class="bg-slate-100 border-none text-slate-900 rounded-lg text-base md:text-lg block w-full h-11">
              <option value="" selected>{{ $t('selectType') }}</option>
              <option value="amount">Donali</option>
              <option value="kg">Kilogrammli</option>
              <option value="g">Gramli</option>
              <option value="litre">Litrli</option>
            </select>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1 space-y-1">
            <label for="price" class="text-base md:text-lg font-medium">
              {{ $t('productionDate') }}
            </label>
            <input id="quantity" type="date" v-model="submitData.productionDate"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
              :placeholder="t('enterProductQuantity')">
          </div>
          <div class="flex-1 space-y-1">
            <label for="price" class="text-base md:text-lg font-medium">
              {{ $t('expirationDate') }}
            </label>
            <input id="quantity" type="date" v-model="submitData.expirationDate"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg">
          </div>
        </div>
        <div class="space-x-2 space-y-1 md:text-left text-center">
          <button v-for="months in [1, 3, 6, 9, 12, 24]" @click="calculateExpirationDate(months)" type="button"
            class="text-slate-600 bg-white hover:bg-slate-100 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-2.5 py-1 hover:text-slate-900 lowercase">+
            {{ months }} {{ t("month") }}</button>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1 space-y-1">
            <label for="toLend" class="text-base md:text-lg font-medium">
              {{ $t('toLend') }}
            </label>
            <div class="flex items-center px-4 border border-gray-200 bg-slate-50 rounded-lg mt-2 lg:mt-0 md:mt-0">
              <input v-model="submitData.toLend" id="toLend" type="checkbox"
                class="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2 mr-2">
              <label for="toLend" class="py-2 text-base font-medium">{{ $t('toLend') }}</label>
            </div>
          </div>
          <div class="flex-1 space-y-1"></div>
        </div>
        <div class="flex space-x-10">
          <div v-if="submitData.salePrice == 0" class="text-base md:text-lg font-medium">
            <label>{{ $t('percent') + ": " }}</label>
            <span class="font-light">0%</span>
          </div>
          <div v-else class="text-base md:text-lg font-medium">
            <label>{{ $t('percent') + ": " }}</label>
            <span class="font-light">{{ calcPercentOfSale(submitData.purchasePrice, submitData.salePrice) + "%" }}</span>
          </div>
          <div class="text-base md:text-lg font-medium">
            <label>{{ $t('sold') + ": " }}</label>
            <span class="font-light">{{ submitData.sold }}</span>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <button v-if="isLoading" type="button"
        class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
        {{ $t('save') }}
      </button>
      <button v-else @click="editProductHistory()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 mx-5">
        {{ $t('save') }}
      </button>
      <CancelButton @click="closeModal" />
    </template>
  </CModal>
</template>