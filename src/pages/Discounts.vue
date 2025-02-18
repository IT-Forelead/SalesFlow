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
import ProductService from '../services/product.service'
import { useBarcodeStore } from '../store/barcode.store'
import { useModalStore } from '../store/modal.store'
import { useProductStore } from '../store/product.store'
import { Money3 } from 'v-money3'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'

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
const productStore = useProductStore()
const products = computed(() => {
  return productStore.products
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
      ProductService.getProductsDetails(
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
          useProductStore().clearStore()
          useProductStore().setProducts(res.data)
        }
      })
    } else if (!isNaN(search.value) && Number.isInteger(+search.value)) {
      ProductService.getProductsDetails(
        cleanObjectEmptyFields({
          serialId: +search.value,
        }),
      ).then((res) => {
        if (res.data.length === 0) {
          toast.warning(t('productNotFound'))
          clearSearchInput()
        } else {
          isLoading.value = false
          useProductStore().clearStore()
          useProductStore().setProducts(res.data)
        }
      })
    } else {
      ProductService.getProductsDetails(
        cleanObjectEmptyFields({
          name: search.value,
        }),
      ).then((res) => {
        isLoading.value = false
        useProductStore().clearStore()
        useProductStore().setProducts(res.data)
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
  useProductStore().clearStore()
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
  useProductStore().clearStore()
})
const isLoadingSend = ref(false)
const selectP = ref()
const sendChannel = () => {
  const data = selectedProducts.value.filter(p => p.discount > 0).map((
    { id, discount }) => ({ productId: id, discount: discount })
  )
  const dataWithImg = selectedProducts.value.filter(p => p.asset)
  isLoadingSend.value = true
  if (selectedProducts.value.length === data.length) {
    if (dataWithImg.length === data.length) {
      ProductService.sendChannel(data)
        .then((res) => {
          selectedProducts.value = []
          selectedProductsBase.value = []
          useProductStore().clearStore()
          toast.success(t('discountSentSuccessfully'))
          isLoadingSend.value = false
        })
        .catch((err) => {
          if (err.response.data.includes('No expiration date found for product')) {
            toast.error(t('plsExpirationDate'))
          } else {
            toast.error(err.message)
          }
            isLoadingSend.value = false
        })
    } else {
      toast.error(t('pleaseEnterImg'))
      isLoadingSend.value = false
    }
  } else {
    toast.error(t('pleaseEnterDiscounts'))
    isLoadingSend.value = false
  }

}

const setDiscount = (event, product) => {

  const data = selectedProductsBase.value.filter(p => p.id == product.id);
  product.discount = event.target.value

  product.price = data[0].price - (product.discount * data[0].price / 100)
}

const setPrice = (product) => {
  const data = selectedProductsBase.value.filter(p => p.id == product.id);

  product.discount = (data[0].price - product.price) * 100 / data[0].price

}

const discount = ref()

const changeAllDiscounts = () => {
  selectedProducts.value.map((p) => {
    p.discount = discount.value
    const data = selectedProductsBase.value.filter(pr => pr.id == p.id);
    p.price = data[0].price - (p.discount * data[0].price / 100)
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
            <SearchIcon class="w-5 h-50 text-slate-400 dark:text-white" />
          </div>
          <input id="globle-search" v-model="search" v-on:keypress="whenPressEnter($event)" type="search"
            ref="onSearchFocus"
            class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 text-base md:text-lg rounded-xl block w-full h-12 pl-10 py-2 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg lg:placeholder:text-base"
            :placeholder="t('searchByProductNameOrBarcode')" />
          <div v-if="search" @click="clearSearchInput()"
            class="absolute inset-y-0 right-20 p-1 flex items-center cursor-pointer">
            <XIcon class="w-5 h-5 text-slate-600" />
          </div>
          <button @click="searchProducts()" type="button"
            class="absolute inset-y-0 right-0 px-4 bg-[#0167F3] text-white rounded-r-xl">
            {{ $t('search') }}
          </button>
          <div v-if="isLoading" class="h-[500px] z-[9999] flex items-center justify-center absolute w-full">
            <Spinners270RingIcon class="w-12 h-12 text-blue-500 animate-spin" />
          </div>
          <ScrollPanel v-if="products.length > 0" ref="searchProductDropdown"
            class="h-[500px] flex flex-row absolute top-16 left-0 bg-transparent w-full space-y-2 ">
            <div v-for="(product, idx) in products" :key="idx" @click="addProduct(product)"
              class="flex items-center justify-between bg-white dark:bg-slate-800 border shadow-sm rounded-xl px-3 py-2 my-2 w-full cursor-pointer hover:bg-slate-100">
              <div class="flex items-center space-x-3">
                <div class="flex items-center justify-center bg-slate-200 w-10 h-10 rounded-lg">
                  <img v-if="product.asset" :src="product.asset.url" class="w-12 h-auto rounded" alt="image">

                          <ImageIcon v-else class="text-gray-500 w-6 h-6" />
                </div>
                <div>
                  <div class="text-base dark:text-white font-semibold text-gray-800">
                    {{ product?.name + ' - ' + product?.packaging }}
                  </div>
                  <div class="text-base font-medium text-gray-500 dark:text-zinc-300">
                    {{ product?.barcode }}
                  </div>
                </div>
              </div>
              <div>
                <div class="text-base font-semibold dark:text-white text-gray-800">
                  {{ useMoneyFormatter(product?.price) }}
                </div>
                <div class="text-base font-medium text-gray-500 dark:text-zinc-300">
                  {{ $t('quantity') }}:
                  <span class="dark:text-white text-gray-700">
                    {{ product?.quantity - product?.sold }}
                  </span>
                </div>
              </div>
            </div>
          </ScrollPanel>
        </div>
        <div @click="useModalStore().openCameraScannerModal()" :title="t('barcodeScanning')"
          class="flex items-center justify-center dark:bg-slate-700 bg-slate-100 rounded-xl h-12 w-12 cursor-pointer">
          <BarcodeIcon class="w-6 h-6 dark:text-blue-400 text-blue-600" />
        </div>
      </div>

      <div v-if="selectedProducts?.length > 0" class=" py-2 align-middle flex flex-col space-y-2">
        <div class="flex flex-col space-y-4">
          <div class="flex h-12 space-x-3 justify-end">
            <input class="w-20 rounded-xl dark:bg-slate-700 dark:text-white bg-slate-100 border-none" placeholder="0" type="number" v-model="discount">
            <button class="w-auto whitespace-nowrap px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
              @click="changeAllDiscounts">{{ $t('changeAll') }}</button>
          </div>

          <div class="flex h-[200px] flex-col space-y-5 ">
            <ScrollPanel class="w-full h-[500px] rounded-xl">
              <table class="md:min-w-full divide-y-8 dark:divide-slate-800 divide-white">
                <thead>
                  <tr class="bg-slate-100 dark:bg-gray-700 text-base font-semibold text-gray-900 dark:text-zinc-200 h-12">
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
                <tbody class="bg-slate-100 dark:bg-gray-700 divide-y-8 dark:divide-slate-800 divide-white">
                  <tr :class="{ 'bg-blue-100, dark:bg-gray-800': selectP === product }" @click="selectProduct(product)"
                    v-for="(product, idx) in selectedProducts" :key="idx" class="overflow-x-auto overflow-y-auto">
                    <td class="px-3 py-2 whitespace-nowrap  rounded-l-xl">
                      <div class="flex items-center space-x-3">
                        <div class="flex items-center justify-center dark:bg-slate-800 bg-slate-200 md:w-12 md:h-12 w-8 h-8 rounded-lg">
                          
                          <img v-if="product.asset" :src="product.asset.url" class="w-12 h-auto rounded">

                          <ImageIcon v-else class="text-gray-500 dark:text-zinc-300 w-6 h-6" />
                        </div>
                        <div>
                          <div
                            class="text-sm md:text-base dark:text-white font-semibold text-gray-800 max-w-full whitespace-break-spaces">
                            {{ product?.name + ' - ' + product?.packaging }}
                          </div>
                          <div class="text-sm md:text-base font-medium text-gray-500 dark:text-zinc-300">
                            {{ $t('price') }}:
                            <span class="text-gray-700 dark:text-white text-sm md:text-base">
                              {{ useMoneyFormatter(product?.price) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td class="px-3 py-2 whitespace-nowrap">
                      <div class="flex justify-center space-x-2 items-center">
                        <input v-model="product.discount" @blur="setDiscount($event, product)"
                          class="bg-slate-100 border dark:border-slate-600 border-slate-200 cursor-pointer text-slate-900 dark:bg-gray-700 dark:text-white rounded-lg dark:placeholder-white w-20 h-12 pl-4 py-2 placeholder-slate-400"
                          type="number" placeholder="0">
                        <span class="dark:text-white">%</span>
                      </div>
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap">
                      <div class="flex justify-center">
                        <money3 v-model.number="product.price" @blur="setPrice(product)" v-bind="moneyConf" id="price"
                          class="w-40 border dark:border-slate-600 border-slate-200 cursor-pointer text-right text-gray-500 dark:bg-gray-700 dark:text-zinc-200 bg-slate-100 h-12 rounded-lg text-lg">
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
              <button v-if="isLoadingSend"
                class="inline-flex items-center justify-center w-40 py-2 px-4 rounded-lg text-white text-base bg-blue-500 cursor-pointer hover:bg-blue-600">
                <Spinners270RingIcon
                  class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-white fill-gray-600 dark:fill-gray-300" />
                {{ $t('send') }}
              </button>
              <button v-else
                class="w-40 py-2 px-4 rounded-lg text-white text-base bg-blue-500 cursor-pointer hover:bg-blue-600"
                @click="sendChannel">
                {{ $t('send') }}
              </button>
            </div>

          </div>
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center border-2 border-dashed h-96 rounded-3xl space-y-1">

        <div class="text-slate-600 dark:text-white text-base text-center">
          {{ $t('searchForProductsOrScanProducts') }}
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped></style>
