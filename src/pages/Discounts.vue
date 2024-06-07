<script setup>
import { onClickOutside } from '@vueuse/core'
import ScrollPanel from 'primevue/scrollpanel'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import BarcodeIcon from '../assets/icons/BarcodeIcon.vue'
import ImageIcon from '../assets/icons/ImageIcon.vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import TrashIcon from '../assets/icons/TrashIcon.vue'
import XIcon from '../assets/icons/XIcon.vue'
import { isBarcode } from '../mixins/barcodeFormatter'
import useMoneyFormatter from '../mixins/currencyFormatter.js'
import { cleanObjectEmptyFields } from '../mixins/utils'
import ProductHistoryService from '../services/productHistory.service'
import ProductService from '../services/product.service'
import { useBarcodeStore } from '../store/barcode.store'
import { useModalStore } from '../store/modal.store'
import { useProductHistoryStore } from '../store/productHistory.store'
import { Money3 } from 'v-money3'

const { t } = useI18n()
const router = useRouter()

const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}


const searchProductDropdown = ref(null)

const search = ref('')
const onSearchFocus = ref(null)
const isLoading = ref(false)
const productHistoryStore = useProductHistoryStore()
const products = computed(() => {
  return productHistoryStore.productHistories
})

onClickOutside(searchProductDropdown, () => {
  clearSearchInput()
})

const searchProducts = () => {
  if (!search.value) {
    toast.warning(t('plsEnterProductNameOrBarcode'))
  } else {
    isLoading.value = true
    if (isBarcode(search.value)) {
      ProductHistoryService.getProductHistories(
        cleanObjectEmptyFields({
          barcode: search.value,
        }),
      ).then((res) => {
        isLoading.value = false
        if (res.data.length === 0) {
          toast.warning(t('productNotFound'))
          clearSearchInput()
        } else if (res.data.length === 1) {
          const product = res.data[0]
          addProduct(product)
        } else {
          useProductHistoryStore().clearStore()
          useProductHistoryStore().setProductHistories(res.data)
        }
      })
    } else if (!isNaN(search.value) && Number.isInteger(+search.value)) {
      ProductHistoryService.getProductHistories(
        cleanObjectEmptyFields({
          serialId: +search.value,
        }),
      ).then((res) => {
        if (res.data.length === 0) {
          toast.warning(t('productNotFound'))
          clearSearchInput()
        } else {
          isLoading.value = false
          useProductHistoryStore().clearStore()
          useProductHistoryStore().setProductHistories(res.data)
        }
      })
    } else {
      ProductHistoryService.getProductHistories(
        cleanObjectEmptyFields({
          name: search.value,
        }),
      ).then((res) => {
        isLoading.value = false
        useProductHistoryStore().clearStore()
        useProductHistoryStore().setProductHistories(res.data)
      })
    }
  }
}

const selectedProductsBase = ref([])
const selectedProducts = ref([])
const addProduct = (product) => {
  if (!selectedProductsBase.value.map((p) => p.id).includes(product.id)) {
    selectedProductsBase.value.push(product)
    selectedProducts.value.push({ ...product })
    clearSearchInput()
  } else {
    clearSearchInput()
  }
}
const selectProduct = (product) => {
  selectP.value = product
}

const removeProduct = (product) => {
  selectedProductsBase.value = selectedProductsBase.value.filter((p) => p.id !== product.id)
  selectedProducts.value = selectedProducts.value.filter((p) => p.id !== product.id)
}

const clearSearchInput = () => {
  search.value = ''
  useProductHistoryStore().clearStore()
}
const whenPressEnter = (e) => {
  if (e.keyCode === 13) {
    searchProducts()
  }
}

watch(
  () => useBarcodeStore().decodedBarcode,
  (data) => {
    if (data && router?.currentRoute?.value?.path === '/sales') {
      search.value = data
      searchProducts()
    }
  },
  { deep: true },
)
onMounted(() => {
  useProductHistoryStore().clearStore()
})

const selectP = ref()
const sendChannel = () => {
  const data = selectedProducts.value.filter(p => p.discount > 0).map((
    { id, discount }) => ({ productId: id, discount: discount })
  )
  if (selectedProducts.value.length == data.length) {
    ProductService.sendChannel(data)
      .then((res) => {
        selectedProducts.value = []
        useProductHistoryStore().clearStore()
        toast.success(t('discountSendSuccessfully'))
      })
  } else {
    toast.error(t('pleaseEnterDiscounts'))

  }

}

const setDiscount = (event, product) => {

  const data = selectedProductsBase.value.filter(p => p.id == product.id);
  product.discount = event.target.value

  product.salePrice = data[0].salePrice - (product.discount * data[0].salePrice / 100)
}

const setPrice = (product) => {
  const data = selectedProductsBase.value.filter(p => p.id == product.id);

  product.discount = (data[0].salePrice - product.salePrice) * 100 / data[0].salePrice

}

const discount = ref()

const changeAllDiscounts = () => {
  selectedProducts.value.map((p) => {
    p.discount = discount.value
    const data = selectedProductsBase.value.filter(pr => pr.id == p.id);
    p.salePrice = data[0].salePrice - (p.discount * data[0].salePrice / 100)
  })
}
</script>

<template>
  <div v-if="products.length > 0" class="fixed top-0 right-0 bottom-0 left-0 z-40 backdrop-blur-[2px] bg-gray-900/70">
  </div>
  <div class="flex flex-col md:flex-row">
    <div class="flex-auto md:w-2/3 w-full space-y-10 py-8 px-4 md:px-8">
      <div class="flex items-center space-x-2 pb-2">
        <div class="relative flex-auto z-50">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon class="w-5 h-50 text-slate-400" />
          </div>
          <input id="globle-search" v-model="search" v-on:keypress="whenPressEnter($event)" type="search"
            ref="onSearchFocus"
            class="bg-slate-100 border-none text-slate-900 text-base md:text-lg rounded-xl block w-full h-12 pl-10 py-2 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg lg:placeholder:text-base"
            :placeholder="t('searchByProductNameOrBarcode')" />
          <div v-if="search" @click="clearSearchInput()"
            class="absolute inset-y-0 right-20 p-1 flex items-center cursor-pointer">
            <XIcon class="w-5 h-5 text-slate-600" />
          </div>
          <button @click="searchProducts()" type="button"
            class="absolute inset-y-0 right-0 px-4 bg-[#0167F3] text-white rounded-r-xl">
            {{ $t('search') }}
          </button>
          <ScrollPanel v-if="products.length > 0" ref="searchProductDropdown"
            class="h-[500px] flex flex-row absolute top-16 left-0 bg-transparent w-full space-y-2 ">
            <div v-for="(product, idx) in products" :key="idx" @click="addProduct(product)"
              class="flex items-center justify-between bg-white border shadow-sm rounded-xl px-3 py-2 my-2 w-full cursor-pointer hover:bg-slate-100">
              <div class="flex items-center space-x-3">
                <div class="flex items-center justify-center bg-slate-200 w-10 h-10 rounded-lg">
                  <ImageIcon class="text-gray-500 w-8 h-8" />
                </div>
                <div>
                  <div class="text-base font-semibold text-gray-800">
                    {{ product?.productName + ' - ' + product?.packaging }}
                  </div>
                  <div class="text-base font-medium text-gray-500">
                    {{ product?.barcode }}
                  </div>
                </div>
              </div>
              <div>
                <div class="text-base font-semibold text-gray-800">
                  {{ useMoneyFormatter(product?.salePrice) }}
                </div>
                <div class="text-base font-medium text-gray-500">
                  {{ $t('quantity') }}:
                  <span class="text-gray-700">
                    {{ product?.quantity - product?.sold }}
                  </span>
                </div>
              </div>
            </div>
          </ScrollPanel>
        </div>
        <div @click="useModalStore().openCameraScannerModal()" :title="t('barcodeScanning')"
          class="flex items-center justify-center bg-slate-100 rounded-xl h-12 w-12 cursor-pointer">
          <BarcodeIcon class="w-6 h-6 text-blue-600" />
        </div>
      </div>

      <div v-if="selectedProducts?.length > 0" class=" py-2 align-middle flex flex-col space-y-2">
        <div class="flex flex-col space-y-4">
          <div class="flex h-12 space-x-3 justify-end">

            <input class="w-20 rounded-xl bg-slate-100 border-none" placeholder="0" type="number" v-model="discount">
            <button class="w-auto whitespace-nowrap px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
              @click="changeAllDiscounts">{{ $t('changeAll') }}</button>

          </div>

          <div class="flex h-[200px] flex-col space-y-5 ">
            <ScrollPanel class="w-full h-[500px] rounded-xl">
              <table class="md:min-w-full divide-y-8 divide-white">
                <thead>
                  <tr class="bg-slate-100 text-base font-semibold text-gray-900 h-12">
                    <th class="px-3 py-2 text-left rounded-l-xl text-sm md:text-base">
                      {{ $t('product') }}
                    </th>
                    <th class="px-3 py-2 text-center text-sm md:text-base">
                      {{ $t('discount') }}
                    </th>
                    <th class="px-3 py-2 text-center text-sm md:text-base">
                      {{ $t('price') }}
                    </th>
                    <th class="px-3 py-2 text-center text-sm md:text-base rounded-r-xl">
                      {{ $t('actions') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-slate-100 divide-y-8 divide-white">
                  <tr :class="{ 'bg-blue-100': selectP === product }" @click="selectProduct(product)"
                    v-for="(product, idx) in selectedProducts" :key="idx" class="overflow-x-auto overflow-y-auto">
                    <td class="px-3 py-2 whitespace-nowrap rounded-l-xl">
                      <div class="flex items-center space-x-3">
                        <div class="flex items-center justify-center bg-slate-200 md:w-12 md:h-12 w-8 h-8 rounded-lg">
                          <ImageIcon class="text-gray-500 w-6 h-6" />
                        </div>
                        <div>
                          <div
                            class="text-sm md:text-base font-semibold text-gray-800 max-w-full whitespace-break-spaces">
                            {{ product?.productName + ' - ' + product?.packaging }}
                          </div>
                          <div class="text-sm md:text-base font-medium text-gray-500">
                            {{ $t('price') }}:
                            <span class="text-gray-700 text-sm md:text-base">
                              {{ useMoneyFormatter(product?.salePrice) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td class="px-3 py-2 whitespace-nowrap">
                      <div class="flex justify-center space-x-2 items-center">
                        <input v-model="product.discount" @blur="setDiscount($event, product)"
                          class="bg-slate-100 border-none text-slate-900 rounded-xl w-20 h-12 pl-4 py-2 placeholder-slate-400"
                          type="number" placeholder="0">
                        <span>%</span>
                      </div>
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap">
                      <div class="flex justify-center">
                        <money3 v-model.number="product.salePrice" @blur="setPrice(product)" v-bind="moneyConf"
                          id="price"
                          class="w-40 border-none text-right text-gray-500 bg-slate-100 h-11 rounded-lg text-lg">
                        </money3>
                      </div>
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap rounded-r-2xl">
                      <div class="flex justify-center">
                        <TrashIcon @click="$event.stopPropagation(); removeProduct(product)"
                          class="w-6 h-6 text-rose-500 cursor-pointer transform hover:scale-105" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

            </ScrollPanel>
            <div class="flex justify-end">
              <button
                class="w-40 py-2 px-4 rounded-lg text-white text-base bg-blue-500 cursor-pointer hover:bg-blue-600"
                @click="sendChannel">{{ $t('send') }}</button>
            </div>

          </div>
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center border-2 border-dashed h-96 rounded-3xl space-y-1">

        <div class="text-slate-600 text-base text-center">
          {{ $t('searchForProductsOrScanProducts') }}
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped></style>
