<script setup>
import { reactive, ref, watch, watchEffect } from 'vue'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import { cleanObjectEmptyFields, roundFloatToOneDecimal } from '../mixins/utils'
import ImageIcon from '../assets/icons/ImageIcon.vue'
import MinusIcon from '../assets/icons/MinusIcon.vue'
import PlusIcon from '../assets/icons/PlusIcon.vue'
import TrashIcon from '../assets/icons/TrashIcon.vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import MoneyIcon from '../assets/icons/MoneyIcon.vue'
import BarcodeIcon from '../assets/icons/BarcodeIcon.vue'
import CreditCardIcon from '../assets/icons/CreditCardIcon.vue'
import XIcon from '../assets/icons/XIcon.vue'
import useMoneyFormatter from '../mixins/currencyFormatter.js'
import ClockIcon from '../assets/icons/ClockIcon.vue'
import ProductService from '../services/product.service'
import OrderService from '../services/order.service'
import { useProductStore } from '../store/product.store'
import { useModalStore } from '../store/modal.store'
import { useBarcodeStore } from '../store/barcode.store'
import { computed, onMounted } from 'vue'
import { isBarcode } from '../mixins/barcodeFormatter'
import { useI18n } from 'vue-i18n'


// onMounted(() => {
//   SettingsService.getSettings().then((res) => {
//     isLoading.value = true
//     submitData.boundaryPrice = res.boundaryPrice
//   }).catch((err) => {
//     toast.error("Get Settiings xato!")
//   })
// });



const openCreateSaleModal = () => {
  showSale.value = false
  onSearchFocus.value = null
  useModalStore().openCreateSaleModal()
}

const { t } = useI18n()
const router = useRouter()

const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

const submitData = reactive({
  discountPercent: 0,
  paymentReceived: 0,
})

const boundaryPrice = ref(300000)
const showSale = ref(false)
const totalPrice = ref(0)
// const totalPriceWithDiscount = ref(0)
const search = ref('')
const onSearchFocus = ref(null)
const isLoading = ref(false)
const selectedProducts = ref([])

const productStore = useProductStore()

const products = computed(() => {
  return productStore.products
})

const saleTypeShortTranslate = (type) => {
  switch (type) {
    case 'amount':
      return t('piece')
    case 'litre':
      return t('litr')
    case 'kg':
      return t('kg')
    case 'g':
      return t('g')
  }
}

const searchProducts = () => {
  if (!search.value) {
    toast.error(t('plsEnterProductNameOrBarcode'))
  } else {
    isLoading.value = true
    if (isBarcode(search.value)) {
      ProductService.getProducts(
        cleanObjectEmptyFields({
          barcode: search.value,
        })
      ).then((res) => {
        isLoading.value = false
        if (res.length == 1) {
          addProductToCart(res[0])
        } else {
          useProductStore().clearStore()
          useProductStore().setProducts(res)
        }
      })
    } else {
      ProductService.getProducts(
        cleanObjectEmptyFields({
          name: '%' + search.value + '%',
        })
      ).then((res) => {
        isLoading.value = false
        if (res.data.length == 1) {
          addProductToCart(res.data[0])
        } else {
          useProductStore().clearStore()
          useProductStore().setProducts(res.data)
        }
      })
    }
  }
}

const addProductToCart = (product) => {
  if (selectedProducts.value.find((p) => p?.productId == product?.id)) {
    selectedProducts.value = selectedProducts.value.map((item) => {
      if (item.productId === product.id && product?.quantity > item.amount) {
        if (item.saleType == 'kg') {
          return { ...item, amount: roundFloatToOneDecimal(item.amount + 0.1) }
        } else if (item.saleType == 'litre') {
          return { ...item, amount: roundFloatToOneDecimal(item.amount + 0.5) }
        } else {
          return { ...item, amount: item.amount + 1 }
        }
      } else if (item.productId === product.id) {
        toast.error(t('productIsOutOfStore'))
        return item
      } else {
        return item
      }
    })
  } else {
    if (product.quantity > 0) {
      if (product?.saleType == 'kg') {
        selectedProducts.value.push({
          productId: product?.id,
          name: product?.name,
          packaging: product?.packaging,
          price: product?.price,
          quantity: product?.quantity,
          saleType: product?.saleType,
          amount: 0.1
        })
      } else if (product?.saleType == 'litre') {
        selectedProducts.value.push({
          productId: product?.id,
          name: product?.name,
          packaging: product?.packaging,
          price: product?.price,
          quantity: product?.quantity,
          saleType: product?.saleType,
          amount: 0.5
        })
      } else {
        selectedProducts.value.push({
          productId: product?.id,
          name: product?.name,
          packaging: product?.packaging,
          price: product?.price,
          quantity: product?.quantity,
          saleType: product?.saleType,
          amount: 1
        })
      }
    } else {
      toast.error('Mahsulot sotuvda mavjud emas!')
    }
  }
  clearSearchInput()
}

const removeProductFromCart = (product) => {
  selectedProducts.value = selectedProducts.value.filter((p) => p.productId !== product.productId)
}

const increaseCountChecking = (product) => {
  if (product?.amount > 0.1 && product?.saleType == 'kg') {
    return true
  } else if (product?.amount > 0.5 && product?.saleType == 'litre') {
    return true
  } else if (product?.amount > 1) {
    return true
  } else {
    return false
  }
}

const increaseCountOfProducts = (product) => {
  selectedProducts.value = selectedProducts.value.map((item) => {
    if (item.productId === product.productId) {
      // return { ...item, amount: item.amount + 1 }
      if (item.saleType == 'kg') {
        return { ...item, amount: roundFloatToOneDecimal(item.amount + 0.1) }
      } else if (item.saleType == 'litre') {
        return { ...item, amount: roundFloatToOneDecimal(item.amount + 0.5) }
      } else {
        return { ...item, amount: item.amount + 1 }
      }
    } else item
    return item
  });
}

const reduceCountOfProducts = (product) => {
  selectedProducts.value = selectedProducts.value.map((item) => {
    if (item.productId === product.productId) {
      // return { ...item, amount: item.amount - 1 }
      if (item.saleType == 'kg') {
        return { ...item, amount: roundFloatToOneDecimal(item.amount - 0.1) }
      } else if (item.saleType == 'litre') {
        return { ...item, amount: roundFloatToOneDecimal(item.amount - 0.5) }
      } else {
        return { ...item, amount: item.amount - 1 }
      }
    } else item
    return item
  });
}

const clearSearchInput = () => {
  search.value = ''
  useProductStore().clearStore()
}

const clearSubmitData = () => {
  submitData.discountPercent = ''
  submitData.paymentReceived = ''
  selectedProducts.value = []
}

const createOrder = () => {
  console.log('dfsdfhgsdhfghsdgf');
  if (selectedProducts.value.length == 0) {
    toast.error("Tanlangan mahsulotlar mavjud emas!")
  } else {
    isLoading.value = true
    OrderService.createOrder(
      cleanObjectEmptyFields({
        discountPercent: submitData.discountPercent,
        paymentReceived: submitData.paymentReceived,
        items: selectedProducts.value,
      })
    ).then((res) => {
      toast.success(t('saleWasMadeSuccessfully'))

      console.log(totalPrice.value);
      if (totalPrice.value >= boundaryPrice.value) {
      showSale.value = true
    } else {
      showSale.value = false
    }

      isLoading.value = false
      clearSubmitData()
    })
  }
}

watch(
  () => selectedProducts.value,
  () => {
    totalPrice.value = selectedProducts.value
      .map((product) => product?.price * product?.amount)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  },
  { deep: true }
)

watch(
  () => totalPrice.value,
  () => {
    submitData.paymentReceived = totalPrice.value
  },
  { deep: true }
)

const whenPressEnter = (e) => {
  if (e.keyCode === 13) {
    searchProducts()
  }
}

watchEffect(() => {
  if (onSearchFocus.value) {
    onSearchFocus.value.focus()
  }
})

const reFocus = () => {
  if (router?.currentRoute?.value?.path === '/sales' && onSearchFocus.value) {
    onSearchFocus.value.focus()
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
  { deep: true }
)

onMounted(() => {
  useProductStore().clearStore()
})
</script>

<template>
  <div v-if="products.length > 0" class="fixed top-0 right-0 bottom-0 left-0 z-50 backdrop-blur-[2px] bg-gray-900/70">
  </div>
  <div class="flex flex-col md:flex-row">
    <div class="flex-auto md:w-2/3 w-full space-y-4 py-8 px-4 md:px-8">
      <div class="flex items-center space-x-2 pb-2">
        <div class="relative flex-auto">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon class="w-5 h-5 text-slate-400" />
          </div>
          <input v-model="search" v-on:keypress="whenPressEnter($event)" type="search" ref="onSearchFocus"
            @blur="reFocus()"
            class="bg-slate-100 border-none text-slate-900 text-base md:text-lg rounded-xl block w-full h-12 pl-10 py-2 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
            :placeholder="t('searchByProductNameOrBarcode')">
          <div v-if="search" @click="clearSearchInput()"
            class="absolute inset-y-0 right-20 p-1 flex items-center cursor-pointer">
            <XIcon class="w-5 h-5 text-slate-600" />
          </div>
          <button @click="searchProducts()" type="button"
            class="absolute inset-y-0 right-0 px-4 bg-[#0167F3] text-white rounded-r-xl">
            {{ $t('search') }}
          </button>
          <div v-if="products.length > 0" class="absolute top-16 left-0 bg-transparent w-full space-y-2 z-50">
            <div v-for="(product, idx) in products" :key="idx" @click="addProductToCart(product)"
              class="flex items-center justify-between bg-white border shadow-sm rounded-xl px-3 py-2 w-full cursor-pointer hover:bg-slate-100">
              <div class="flex items-center space-x-3">
                <div class="flex items-center justify-center bg-slate-200 w-10 h-10 rounded-lg">
                  <ImageIcon class="text-gray-500 w-8 h-8" />
                </div>
                <div>
                  <div class="text-base font-semibold text-gray-800">
                    {{ product?.name + " - " + product?.packaging }}
                  </div>
                  <div class="text-base font-medium text-gray-500">
                    {{ product?.barcode }}
                  </div>
                </div>
              </div>
              <div>
                <div class="text-base font-semibold text-gray-800">
                  {{ useMoneyFormatter(product?.price) }}
                </div>
                <div class="text-base font-medium text-gray-500">
                  {{ $t('quantity') }}:
                  <span class="text-gray-700">
                    {{ product?.quantity }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div @click="useModalStore().openCameraScannerModal()"
          class="flex items-center justify-center bg-slate-100 rounded-xl h-12 w-12 cursor-pointer">
          <BarcodeIcon class="w-6 h-6 text-blue-600" />
        </div>
        <div class="hidden md:flex items-center justify-center bg-slate-100 rounded-xl h-12 w-12">
          <ClockIcon class="w-5 h-5 text-blue-600" />
        </div>
      </div>

      <div class="text-slate-900 text-2xl md:text-3xl font-semibold">
        {{ $t('shoppingCart') }}
      </div>

      <div v-if="selectedProducts.length > 0" class="inline-block md:min-w-full py-2 align-middle">
        <div class="overflow-x-auto overflow-y-auto border border-white">
          <div class="min-w-full">
            <table class="md:min-w-full divide-y-8 divide-white">
              <thead>
                <tr class="bg-slate-100 text-base font-semibold text-gray-900  h-12">
                  <th class="px-3 py-2 text-left rounded-l-xl text-sm md:text-base">
                    {{ $t('product') }}
                  </th>
                  <th class="px-3 py-2 text-center text-sm md:text-base">
                    {{ $t('quantity') }}
                  </th>
                  <th class="px-3 py-2 text-center text-sm md:text-base">
                    {{ $t('totalPrice') }}
                  </th>
                  <th class="px-3 py-2 text-center text-sm md:text-base rounded-r-xl">
                    {{ $t('actions') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-slate-100 divide-y-8 divide-white">
                <tr v-for="(product, idx) in selectedProducts" :key="idx">
                  <td class="px-3 py-2 whitespace-nowrap rounded-l-xl">
                    <div class="flex items-center space-x-3">
                      <div class="flex items-center justify-center bg-slate-200 md:w-12 md:h-12 w-8 h-8 rounded-lg">
                        <ImageIcon class="text-gray-500 w-6 h-6" />
                      </div>
                      <div>
                        <div class="text-sm md:text-base font-semibold text-gray-800">
                          {{ product?.name + " - " + product?.packaging }}
                        </div>
                        <div class="text-sm md:text-base font-medium text-gray-500">
                          {{ $t('price') }}:
                          <span class="text-gray-700 text-sm md:text-base">
                            {{ useMoneyFormatter(product?.price) }}
                          </span>
                          <div v-if="product.quantity <= 15">
                            {{ $t('remainingAmount') }}:
                            <span class="text-red-500 text-sm md:text-base">
                              {{ product?.quantity - product?.amount }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 py-2 text-center whitespace-nowrap">
                    <div class="flex justify-center">
                      <div class="flex items-center justify-between bg-slate-100 w-36 rounded-xl p-1">
                        <div @click="reduceCountOfProducts(product)" v-if="increaseCountChecking(product)"
                          class="flex items-center justify-center w-8 h-8 bg-white text-blue-700 shadow-sm hover:bg-slate-200 cursor-pointer rounded-xl">
                          <MinusIcon class="w-4 h-4" />
                        </div>
                        <div v-else
                          class="flex items-center justify-center w-8 h-8 bg-white text-slate-700 cursor-default rounded-xl">
                          <MinusIcon class="w-4 h-4" />
                        </div>
                        <div class="flex items-center justify-center text-lg font-normal">
                          {{ product?.amount + " " + saleTypeShortTranslate(product?.saleType) }}
                        </div>
                        <div @click="increaseCountOfProducts(product)" v-if="product?.quantity > product?.amount"
                          class="flex items-center justify-center w-8 h-8 bg-white text-blue-700 shadow-sm hover:bg-slate-200 cursor-pointer rounded-xl">
                          <PlusIcon class="w-4 h-4" />
                        </div>
                        <div v-else
                          class="flex items-center justify-center w-8 h-8 bg-white text-slate-700 cursor-default rounded-xl">
                          <PlusIcon class="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 py-2 text-center whitespace-nowrap">
                    {{ useMoneyFormatter(product?.price * product?.amount) }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap rounded-r-2xl">
                    <div class="flex justify-center">
                      <TrashIcon @click="removeProductFromCart(product)"
                        class="w-6 h-6 text-rose-500 cursor-pointer transform hover:scale-105" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center border-2 border-dashed h-96 rounded-3xl space-y-1">
        <h4 class="text-slate-900 text-xl font-semibold">
          {{ $t('cartIsCurrentlyEmpty') }}
        </h4>
        <div class="text-slate-600 text-base text-center">
          {{ $t('searchForProductsOrScanProducts') }}
        </div>
      </div>
    </div>

    <div class="flex-auto md:w-1/3 w-full border-l h-dvh py-8 px-4 md:px-8 space-y-4">
      <!-- <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold">Mijoz</h3>
          <h3 class="text-balance font-semibold text-blue-600">Yaratish</h3>
        </div>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon cluseMoneyFormatterass="w-5 h-5 text-slate-400" />
          </div>
          <input type="text"
            class="bg-slate-100 border-none text-slate-700 text-base rounded-xl block w-full pl-10 placeholder-slate-400"
            placeholder="Mijozni tanlang">
        </div>
      </div>
      <div class="space-y-2">
        <h3 class="text-xl font-semibold">Chegirma</h3>
        <input type="text"
          class="bg-slate-100 border-none text-slate-700 text-base rounded-xl h-10 block w-full placeholder-slate-400"
          placeholder="Mijozni tanlang">
      </div> -->

      <div class="space-y-2">
        <h3 class="text-xl font-semibold">
          {{ $t('salesDetails') }}
        </h3>
        <div class="pb-3 space-y-1">
          <div class="flex items-center justify-between">
            <div class="text-base text-gray-600">
              {{ $t('numberOfProducts') }}
            </div>
            <div class="text-base font-semibold text-gray-900">
              {{ selectedProducts.length + " " + $t('piece') }}
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-base text-gray-600">
              {{ $t('price') }}
            </div>
            <div class="text-base font-semibold text-gray-900">
              {{ useMoneyFormatter(totalPrice) }}
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-base text-gray-600">
              {{ $t('discount') }}
            </div>
            <div class="text-base font-semibold text-gray-900">
              {{ submitData.discountPercent }} %
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-base text-gray-600">
              {{ $t('discountAmount') }}
            </div>
            <div class="text-base font-semibold text-red-500">
              -{{ useMoneyFormatter(0) }}
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between mt-2 pt-3 border-t border-dashed">
          <div class="text-xl font-semibold text-gray-900">
            {{ $t('total') }}
          </div>
          <div class="text-xl font-semibold text-gray-900">
            {{ useMoneyFormatter(totalPrice) }}
          </div>
        </div>
      </div>

      <div class="space-y-1">
        <label class="text-base font-medium">
          {{ $t('paymentReceived') }}
        </label>
        <money3 v-model="submitData.paymentReceived" v-bind="moneyConf" id="price"
          class="border-none text-right text-gray-500 bg-slate-100 rounded-lg w-full text-lg" disabled>
        </money3>
      </div>
      <div class="py-3 space-y-1">
        <div class="text-base font-medium">
          {{ $t('paymentType') }}
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1 flex flex-col items-center justify-center bg-blue-50 border border-blue-300 rounded-lg py-4">
            <MoneyIcon class="w-6 h-6 text-blue-500" />
            <div class="text-lg font-medium text-blue-500">
              {{ $t('withCash') }}
            </div>
          </div>
          <div class="flex-1 flex flex-col items-center justify-center border rounded-lg py-4">
            <CreditCardIcon class="w-6 h-6 text-gray-500" />
            <div class="text-lg font-medium">
              {{ $t('withPlasticCard') }}
            </div>
          </div>
        </div>
      </div>

      <button @click="createOrder()"
        class="w-full py-3 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
        {{ $t('payment') }}
      </button>
      <div>
        <button v-if='showSale'  @click="openCreateSaleModal"
        class="w-72 py-3 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          Chegirma
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>