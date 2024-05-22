<script setup>
import { computed, onMounted, reactive, ref, watch, watchEffect } from 'vue'
import { vMaska } from 'maska'
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
import OnlinePaymentIcon from '../assets/icons/OnlinePaymentIcon.vue'
import DebtIcon from '../assets/icons/DebtIcon.vue'
import XIcon from '../assets/icons/XIcon.vue'
import useMoneyFormatter from '../mixins/currencyFormatter.js'
import ProductService from '../services/product.service'
import OrderService from '../services/order.service'
import CustomerService from '../services/customer.service'
import SettingsService from '../services/settings.service'
import { useProductStore } from '../store/product.store'
import { useModalStore } from '../store/modal.store'
import { useBarcodeStore } from '../store/barcode.store'
import { isBarcode } from '../mixins/barcodeFormatter'
import { useI18n } from 'vue-i18n'
import BasketIcon from '../assets/icons/BasketIcon.vue'
import BroomIcon from '../assets/icons/BroomIcon.vue'
import CancelButton from '../components/buttons/CancelButton.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import axios from 'axios'
import moment from 'moment'
import { onClickOutside } from '@vueuse/core'
import ScrollPanel from 'primevue/scrollpanel'
import { Money3 } from 'v-money3'

const API_URL = import.meta.env.VITE_CHEQUE_API_URL

const { t } = useI18n()
const router = useRouter()

const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

const submitData = reactive({
  discountPercent: null,
  paymentReceived: 0,
})

const boundaryPrice = ref(0)

onMounted(() => {
  SettingsService.getSettings().then((res) => {
    isLoading.value = true
    if (res) {
      boundaryPrice.value = res.boundaryPrice
    }
  })
})

const showDebtForm = ref(false)
const searchProductDropdown = ref(null)
const orderId = ref()
const showSale = ref(false)
const totalPrice = ref(0)
// const totalPriceWithDiscount = ref(0)
const search = ref('')
const onSearchFocus = ref(null)
const onFullNameFocus = ref(null)
const onPhoneFocus = ref(null)
const isLoading = ref(false)
// const selectedProducts = ref([])
const activeBasketStatus = ref('firstBasket')
const activeBasket = ref([])
const firstBasket = ref([])
const secondBasket = ref([])
const thirdBasket = ref([])
const qrcode = ref()
const phoneRegex = /\+998[1-9]\d{8}/

const baskets = [
  {
    id: 'firstBasket',
    name: t('firstBasket'),
  },
  {
    id: 'secondBasket',
    name: t('secondBasket'),
  },
  {
    id: 'thirdBasket',
    name: t('thirdBasket'),
  },
]

const productStore = useProductStore()

const products = computed(() => {
  return productStore.products
})

const saleTypeShortTranslate = (type) => {
  switch (type) {
    case 'amount':
      return t('piece')
    case 'litre':
      return t('litre')
    case 'kg':
      return t('kg')
    case 'g':
      return t('g')
  }
}

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
          let amount = null
          if (String(search.value).startsWith('9')) {
            const quantity = Number.parseInt(String(search.value).substring(8, 12))
            amount = product.saleType.includes('kg') ? quantity / 1000 : quantity
          }
          addProductToCart(product, amount)
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
          console.log(res.data)
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

const addProductToCart = (product, amount) => {
  if (activeBasket.value.find((p) => p?.productId === product?.id)) {
    activeBasket.value = activeBasket.value.map((item) => {
      if (item.productId === product.id && product?.quantity > item.amount) {
        if (amount) {
          return { ...item, amount: item.amount + amount }
        } else if (item.saleType === 'kg') {
          return { ...item, amount: roundFloatToOneDecimal(item.amount + 0.1) }
        } else if (item.saleType === 'litre') {
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
      if (amount) {
        activeBasket.value.push({
          productId: product?.id,
          name: product?.name,
          packaging: product?.packaging,
          price: product?.price,
          quantity: product?.quantity,
          saleType: product?.saleType,
          amount: amount,
          serialId: product?.serialId,
        })
      } else if (product?.saleType === 'kg') {
        activeBasket.value.push({
          productId: product?.id,
          name: product?.name,
          packaging: product?.packaging,
          price: product?.price,
          quantity: product?.quantity,
          saleType: product?.saleType,
          amount: 0.1,
          serialId: product?.serialId,
        })
      } else if (product?.saleType === 'litre') {
        activeBasket.value.push({
          productId: product?.id,
          name: product?.name,
          packaging: product?.packaging,
          price: product?.price,
          quantity: product?.quantity,
          saleType: product?.saleType,
          amount: 0.5,
        })
      } else {
        activeBasket.value.push({
          productId: product?.id,
          name: product?.name,
          packaging: product?.packaging,
          price: product?.price,
          quantity: product?.quantity,
          saleType: product?.saleType,
          amount: 1,
          serialId: product?.serialId,
        })
      }
    } else {
      toast.error('Mahsulot sotuvda mavjud emas!')
    }
  }
  clearSearchInput()
}

const selectProduct = (product) => {
  selectP.value = product
  inputValue.value = '0'
}

const removeProductFromCart = (product) => {
  activeBasket.value = activeBasket.value.filter((p) => p.productId !== product.productId)
  if (selectP.value === product) {
    selectP.value = undefined
  }

}

const changeBasketStatus = (status) => {
  activeBasketStatus.value = status
}

const reduceCountChecking = (product) => {
  if (product?.amount > 0.1 && product?.saleType === 'kg') {
    return true
  } else if (product?.amount > 0.5 && product?.saleType === 'litre') {
    return true
  } else return product?.amount > 1
}

const increaseCountChecking = (product) => {
  if (product?.saleType === 'kg') {
    return product?.quantity >= product?.amount + 0.1
  } else if (product?.saleType === 'litre') {
    return product?.quantity >= product?.amount + 0.5
  } else return product?.quantity >= product?.amount + 1
}

const increaseCountOfProducts = (product) => {
  activeBasket.value = activeBasket.value.map((item) => {
    if (item.productId === product.productId) {
      // return { ...item, amount: item.amount + 1 }
      if (item.saleType === 'kg') {
        return { ...item, amount: roundFloatToOneDecimal(item.amount + 0.1) }
      } else if (item.saleType === 'litre') {

        return { ...item, amount: roundFloatToOneDecimal(item.amount + 0.5) }
      } else {
        return { ...item, amount: item.amount + 1 }
      }
    } else item
    return item
  })
}

const reduceCountOfProducts = (product) => {
  activeBasket.value = activeBasket.value.map((item) => {
    if (item.productId === product.productId) {
      // return { ...item, amount: item.amount - 1 }
      if (item.saleType === 'kg') {
        return { ...item, amount: roundFloatToOneDecimal(item.amount - 0.1) }
      } else if (item.saleType === 'litre') {
        return { ...item, amount: roundFloatToOneDecimal(item.amount - 0.5) }
      } else {
        return { ...item, amount: item.amount - 1 }
      }
    } else item
    return item
  })
}

const clearSearchInput = () => {
  search.value = ''
  useProductStore().clearStore()
}

const clearSubmitData = () => {
  submitData.discountPercent = ''
  submitData.paymentReceived = ''
  activeBasket.value = []
  if (activeBasketStatus.value === 'firstBasket') {
    firstBasket.value = []
  } else if (activeBasketStatus.value === 'secondBasket') {
    secondBasket.value = []
  } else if (activeBasketStatus.value === 'thirdBasket') {
    thirdBasket.value = []
  }
}

const createOrder = () => {
  if (activeBasket.value.length === 0) {
    toast.error('Tanlangan mahsulotlar mavjud emas!')
  } else {
    isLoading.value = true
    OrderService.createOrder(
      cleanObjectEmptyFields({
        discountPercent: submitData.discountPercent,
        paymentReceived: submitData.paymentReceived,
        items: activeBasket.value,
      }),
    )
      .then((res) => {
        orderId.value = res
        toast.success(t('saleWasMadeSuccessfully'))
        if (boundaryPrice.value !== 0 && totalPrice.value >= boundaryPrice.value) {
          orderId.value = res
          showSale.value = true
          onSearchFocus.value = null
          qrcode.value = API_URL + `/customer-form/${res}`
        } else {
          showSale.value = false
          qrcode.value = null
        }

        isLoading.value = false
        clearSubmitData()
        if (showSale.value) {
          setTimeout(() => {
            onSearchFocus.value = null
          }, 3000)
        }
        OrderService.getOrderById(res).then((res) => {
          printChaque({
            cashier: res?.cashierFirstName + ' ' + res.cashierLastName,
            discount: res?.discountPercent ?? 0,
            discount_amount: res?.discountPrice ?? 0,
            final_price: res?.totalPrice,
            market: res?.marketName,
            paid: res?.paymentReceived,
            price: res?.initialPrice,
            products: res?.items.map((item) => {
              return {
                count: item?.amount,
                name: item?.productName,
                packaging: item?.packaging,
                price: item?.salePrice,
                total: item?.price,
              }
            }),
            time: moment(res?.createdAt).format('DD/MM/YYYY H:mm'),
            qrcode: qrcode.value,
          })
        })
      })
      .catch(() => {
        toast.error(t('errorWhileCreatingOrder'))
        isLoading.value = false
      })
  }
}

async function printChaque(data) {
  await axios
    .post(API_URL + '/print', data)
    .then(async () => {
    })
    .catch(() => {
    })
}

watch(
  () => activeBasket.value,
  () => {
    totalPrice.value = activeBasket.value.map((product) => product?.price * product?.amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
  },
  { deep: true },
)

watch(
  () => totalPrice.value,
  () => {
    submitData.paymentReceived = totalPrice.value
  },
  { deep: true },
)

const whenPressEnter = (e) => {
  if (e.keyCode === 13) {
    searchProducts()
  }
}

watchEffect(() => {
  if (onSearchFocus.value) {
    onSearchFocus.value.focus()
    onFullNameFocus.value = null
    onPhoneFocus.value = null
  }
})
watchEffect(() => {
  if (onFullNameFocus.value) {
    onFullNameFocus.value.focus()
    onSearchFocus.value = null
    onPhoneFocus.value = null
  }
})
watchEffect(() => {
  if (onPhoneFocus.value) {
    onPhoneFocus.value.focus()
    onSearchFocus.value = null
    onFullNameFocus.value = null
  }
})

const reFocus = () => {
  if (router?.currentRoute?.value?.path === '/sales' && onSearchFocus.value) {
    onSearchFocus.value.focus()
  }
}

const fullNameReFocus = () => {
  if (router?.currentRoute?.value?.path === '/sales' && onFullNameFocus.value) {
    onFullNameFocus.value.focus()
    onSearchFocus.value = null
    onPhoneFocus.value = null
  }
}

const phoneReFocus = () => {
  if (router?.currentRoute?.value?.path === '/sales' && onPhoneFocus.value) {
    onPhoneFocus.value.focus()
    onSearchFocus.value = null
    onFullNameFocus.value = null
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

watch(
  () => activeBasketStatus.value,
  (data) => {
    if (data === 'firstBasket') {
      activeBasket.value = firstBasket.value
    } else if (data === 'secondBasket') {
      activeBasket.value = secondBasket.value
    } else if (data === 'thirdBasket') {
      activeBasket.value = thirdBasket.value
    }
  },
  { deep: true },
)

watch(
  () => activeBasket.value,
  () => {
    if (activeBasketStatus.value === 'firstBasket') {
      firstBasket.value = activeBasket.value
    } else if (activeBasketStatus.value === 'secondBasket') {
      secondBasket.value = activeBasket.value
    } else if (activeBasketStatus.value === 'thirdBasket') {
      thirdBasket.value = activeBasket.value
    }
  },
  { deep: true },
)

onMounted(() => {
  useProductStore().clearStore()
})

const isLoadingCustomerForm = ref(false)
const isLoadingDebtForm = ref(false)
const customerForm = reactive({
  fullName: '',
  phone: '',
})

const clearCustomerForm = () => {
  customerForm.fullName = ''
  customerForm.phone = ''
}

const closeForm = () => {
  showSale.value = false
  clearCustomerForm()
}

const createSale = () => {
  if (!customerForm.fullName) {
    toast.warning(t('enterFullName'))
  } else if (!customerForm.phone) {
    toast.warning(t('enterPhone'))
  } else if (customerForm.phone && !phoneRegex.test(customerForm.phone.replace(/([() -])/g, ''))) {
    toast.warning(t('plsEnterValidPhoneNumber'))
  } else {
    isLoadingCustomerForm.value = true
    CustomerService.createCustomer({
      orderId: orderId.value,
      fullName: customerForm.fullName,
      phone: customerForm.phone.replace(/([() -])/g, ''),
    })
      .then(() => {
        isLoadingCustomerForm.value = false
        closeForm()
        toast.success('Chegirma yaratildi!')
      })
      .catch(() => {
        isLoadingCustomerForm.value = false
        toast.error('Chegirma yaratishda xatolik yuz berdi!')
      })
  }
}

const closeDebtForm = () => {
  showDebtForm.value = false
  clearCustomerForm()
  selectP.value = undefined
}
const createDebt = () => {
  if (!customerForm.fullName) {
    toast.warning(t('enterFullName'))
  } else if (!customerForm.phone) {
    toast.warning(t('enterPhone'))
  } else if (customerForm.phone && !phoneRegex.test(customerForm.phone.replace(/([() -])/g, ''))) {
    toast.warning(t('plsEnterValidPhoneNumber'))
  } else {
    isLoadingDebtForm.value = true
    CustomerService.createDebt({
      orderId: orderId.value,
      fullName: customerForm.fullName,
      phone: customerForm.phone.replace(/([() -])/g, ''),
    })
      .then(() => {
        isLoadingDebtForm.value = false
        closeDebtForm()
        toast.success(t('debtCreatedSuccessfully'))
      })
      .catch(() => {
        isLoadingDebtForm.value = false
        toast.error(t('errorWhileCreatingDebt'))
      })
  }
}

const selectP = ref()
const inputValue = ref('0')

const appendValue = (value) => {
  if (inputValue.value === '0') {
    if (value !== '0') {
      inputValue.value = ''
    } else {
      return
    }
  }
  if (inputValue.value + value.toString() <= selectP.value.quantity) {
    inputValue.value += value.toString()
    selectP.value.amount = parseFloat(inputValue.value)
  } else {
    toast.warning('max count is ' + selectP.value.quantity)
  }
}

const separator = () => {
  if (selectP.value.saleType === 'amount') {
    toast.warning('comma is forbidden')
  } else {
    inputValue.value += '.'
  }


}

const removeLastDigit = () => {
  if (inputValue.value.length > 1) {
    inputValue.value = inputValue.value.slice(0, -1)
    selectP.value.amount = parseFloat(inputValue.value)
  } else {
    inputValue.value = '0'
    selectP.value.amount = 1
  }
}
</script>

<template>
  <div v-if="products.length > 0" class="fixed top-0 right-0 bottom-0 left-0 z-40 backdrop-blur-[2px] bg-gray-900/70">
  </div>
  <div class="flex flex-col md:flex-row">
    <div class="flex-auto md:w-2/3 w-full space-y-4 py-8 px-4 md:px-8">
      <div class="flex items-center space-x-2 pb-2">
        <div class="relative flex-auto z-50">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon class="w-5 h-5 text-slate-400" />
          </div>
          <input v-model="search" v-on:keypress="whenPressEnter($event)" type="search" ref="onSearchFocus"
                 @blur="reFocus()"
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
            <div v-for="(product, idx) in products" :key="idx" @click="addProductToCart(product)"
                 class="flex items-center justify-between bg-white border shadow-sm rounded-xl px-3 py-2 my-2 w-full cursor-pointer hover:bg-slate-100">
              <div class="flex items-center space-x-3">
                <div class="flex items-center justify-center bg-slate-200 w-10 h-10 rounded-lg">
                  <ImageIcon class="text-gray-500 w-8 h-8" />
                </div>
                <div>
                  <div class="text-base font-semibold text-gray-800">
                    {{ product?.name + ' - ' + product?.packaging }}
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
          </ScrollPanel>
        </div>

        <div @click="useModalStore().openCameraScannerModal()" :title="t('barcodeScanning')"
             class="flex items-center justify-center bg-slate-100 rounded-xl h-12 w-12 cursor-pointer">
          <BarcodeIcon class="w-6 h-6 text-blue-600" />
        </div>
        <div @click="clearSubmitData()" :title="t('clearTheBasket')"
             class="hidden md:flex items-center justify-center bg-slate-100 rounded-xl h-12 w-12 cursor-pointer">
          <BroomIcon class="w-5 h-5 text-blue-600" />
        </div>
      </div>

      <div class="flex items-center justify-between space-x-2">
        <div class="text-slate-900 text-2xl md:text-3xl font-semibold">
          {{ $t('shoppingCart') }}
        </div>
        <div class="flex space-x-2">
          <div v-for="(basket, idx) in baskets" :key="idx" @click="changeBasketStatus(basket.id)"
               class="px-4 py-2 inline-flex flex-col xl:flex-row sm:flex items-center leading-none border-b-2 rounded-xl"
               :class="activeBasketStatus === basket.id ? 'bg-slate-100 border-blue-500' : 'bg-slate-50 border-slate-200 cursor-pointer'">
            <BasketIcon class="w-6 h-6 mr-2"
                        :class="activeBasketStatus === basket.id ? 'text-blue-500 text-sm' : 'text-gray-500 text-sm'" />
            <span :class="activeBasketStatus === basket.id ? 'text-blue-500 text-sm' : 'text-gray-900 text-sm'">
              {{ basket.name }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="activeBasket.length > 0" class=" py-2 align-middle">
        <div class="min-w-full">
          <ScrollPanel class="w-full h-[550px] rounded-xl">
            <table class="md:min-w-full divide-y-8 divide-white">
              <thead>
              <tr class="bg-slate-100 text-base font-semibold text-gray-900 h-12">
                <th class="px-3 py-2 text-left rounded-l-xl text-sm md:text-base">
                  {{ $t('product') }}
                </th>
                <th class="px-3 py-2 text-center text-sm md:text-base">
                  {{ $t('serialId') }}
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
              <tr :class="{ 'bg-blue-100': selectP === product }" @click="selectProduct(product)"
                  v-for="(product, idx) in activeBasket" :key="idx" class="overflow-x-auto overflow-y-auto">
                <td class="px-3 py-2 whitespace-nowrap rounded-l-xl">
                  <div class="flex items-center space-x-3">
                    <div class="flex items-center justify-center bg-slate-200 md:w-12 md:h-12 w-8 h-8 rounded-lg">
                      <ImageIcon class="text-gray-500 w-6 h-6" />
                    </div>
                    <div>
                      <div class="text-sm md:text-base font-semibold text-gray-800 max-w-full whitespace-break-spaces">
                        {{ product?.name + ' - ' + product?.packaging }}
                      </div>
                      <div class="text-sm md:text-base font-medium text-gray-500">
                        {{ $t('price') }}:
                        <span class="text-gray-700 text-sm md:text-base">
                              {{ useMoneyFormatter(product?.price) }}
                            </span>
                        <div v-if="product.quantity <= 15">
                          {{ $t('remainingAmount') }}:
                          <span class="text-red-500 text-sm md:text-base">
                                {{ roundFloatToOneDecimal(product?.quantity - product?.amount) }}
                              </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2 text-center whitespace-nowrap">
                  {{ product?.serialId }}
                </td>
                <td class="px-3 py-2 text-center whitespace-nowrap">
                  <div class="flex justify-center">
                    <div class="flex items-center justify-between w-36 rounded-xl p-1">
                      <div @click="reduceCountOfProducts(product)" v-if="reduceCountChecking(product)"
                           class="flex items-center justify-center w-8 h-8 bg-white text-blue-700 shadow-sm hover:bg-slate-200 cursor-pointer rounded-xl">
                        <MinusIcon class="w-4 h-4" />
                      </div>
                      <div v-else
                           class="flex items-center justify-center w-8 h-8 bg-white text-slate-700 cursor-default rounded-xl">
                        <MinusIcon class="w-4 h-4" />
                      </div>

                      <div class="flex items-center justify-center text-lg font-normal">
                        {{ product?.amount + ' ' + saleTypeShortTranslate(product?.saleType) }}
                      </div>
                      <div @click="increaseCountOfProducts(product)" v-if="increaseCountChecking(product)"
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
                    <TrashIcon @click="$event.stopPropagation(); removeProductFromCart(product)"
                               class="w-6 h-6 text-rose-500 cursor-pointer transform hover:scale-105" />
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </ScrollPanel>
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
              {{ activeBasket.length + ' ' + $t('piece') }}
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
            <div class="text-base font-semibold text-gray-900">{{ submitData.discountPercent }} %</div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-base text-gray-600">
              {{ $t('discountAmount') }}
            </div>
            <div class="text-base font-semibold text-red-500">-{{ useMoneyFormatter(0) }}</div>
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
                class="border-none text-right text-gray-500 bg-slate-100 rounded-lg w-full text-lg" disabled></money3>
      </div>
      <div class="py-3 lg:py-0 space-y-1">
        <div class="text-base font-medium">
          {{ $t('paymentType') }}
        </div>
        <div class="flex w-full space-x-2 lg:space-x-0 xl:space-x-4 xl:space-y-0 lg:space-y-2 lg:flex-col xl:flex-row">
          <div
            class="flex-1 flex flex-col w-full items-center justify-center bg-blue-50 border border-blue-300 rounded-lg py-4">
            <MoneyIcon class="w-6 h-6 text-blue-500" />
            <div class="text-lg font-medium text-blue-500">
              {{ $t('withCash') }}
            </div>
          </div>
          <div class="flex-1 flex flex-col items-center justify-center border rounded-lg py-4">
            <CreditCardIcon class="w-6 h-6 text-gray-500" />
            <div class="text-lg font-medium text-center">
              {{ $t('withPlasticCard') }}
            </div>
          </div>
        </div>
        <div class="flex w-full space-x-2 lg:space-x-0 xl:space-x-4 xl:space-y-0 lg:space-y-2 lg:flex-col xl:flex-row">
          <div class="flex-1 flex flex-col w-full items-center justify-center border rounded-lg py-4">
            <OnlinePaymentIcon class="w-6 h-6" />
            <div class="text-lg font-medium">
              {{ $t('withClick') }}
            </div>
          </div>
          <div @click="showDebtForm = !showDebtForm" :class="showDebtForm ? 'border-blue-300 bg-blue-50' : ''"
               class="flex-1 flex flex-col hover:border-blue-300 hover:bg-blue-50 hover:cursor-pointer items-center justify-center border rounded-lg py-4">
            <DebtIcon class="w-6 h-6 text-gray-500" />
            <div class="text-lg font-medium">
              {{ $t('intoDebt') }}
            </div>
          </div>
        </div>
      </div>
      <div class="space-y-6">
        <button @click="createOrder()"
                class="w-full xl:py-3 px-4 lg:py-2 py-3 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          {{ $t('payment') }}
        </button>
        <div v-if="showDebtForm" class="flex flex-col space-y-4">
          <div>
            <div class="flex flex-col items-center space-y-4">
              <div class="w-full">
                <label for="fullName" class="text-base font-medium">
                  {{ $t('fullName') }}
                  <span class="text-red-500 mr-2">*</span>
                </label>
                <input ref="onFullNameFocus" @blur="fullNameReFocus()" id="fullName" type="text"
                       v-model="customerForm.fullName"
                       class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                       :placeholder="t('enterFullName')" />
              </div>
              <div class="w-full">
                <label for="phone" class="text-base font-medium">
                  {{ $t('phone') }}
                  <span class="text-red-500 mr-2">*</span>
                </label>
                <input ref="onPhoneFocus" @blur="phoneReFocus()" id="phone" type="text" v-model="customerForm.phone"
                       v-maska data-maska="+998(##) ###-##-##"
                       class="bg-slate-100 border-none w-full text-slate-900 rounded-lg py-2.5 placeholder-slate-400"
                       placeholder="+998(00) 000-00-00" />
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <CancelButton class="w-full" @click="closeDebtForm" />
            <button @click="createDebt"
                    class="w-full xl:py-3 px-4 lg:py-2 py-3 rounded-full text-white flex items-center justify-center text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
              <Spinners270RingIcon v-if="isLoadingDebtForm"
                                   class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
              {{ $t('intoDebt') }}
            </button>
          </div>
        </div>

        <div v-if="showSale" class="flex flex-col space-y-8">
          <h3 class="text-xl font-semibold">{{ $t('addCustomer') }}</h3>
          <div>
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <label for="fullName" class="text-base font-medium">
                  {{ $t('fullName') }}
                  <span class="text-red-500 mr-2">*</span>
                </label>
                <input ref="onFullNameFocus" @blur="fullNameReFocus()" id="fullName" type="text"
                       v-model="customerForm.fullName"
                       class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                       :placeholder="t('enterFullName')" />
              </div>
              <div class="flex-1">
                <label for="phone" class="text-base font-medium">
                  {{ $t('phone') }}
                  <span class="text-red-500 mr-2">*</span>
                </label>
                <input ref="onPhoneFocus" @blur="phoneReFocus()" id="phone" type="text" v-model="customerForm.phone"
                       v-maska data-maska="+998(##) ###-##-##"
                       class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                       placeholder="+998(00) 000-00-00" />
              </div>
            </div>
          </div>
          <div>
            <CancelButton @click="closeForm" />
            <button v-if="isLoadingCustomerForm"
                    class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
              <Spinners270RingIcon
                class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
              {{ $t('create') }}
            </button>
            <button v-else @click="createSale()" type="button"
                    class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
              {{
                $t('create') }}
            </button>
          </div>
        </div>
      </div>
      <div>
        <div v-if="selectP && selectP != undefined" class="h-52 grid grid-cols-3 grid-rows-4 gap-2">
          <div
            class="flex items-center justify-center text-lg cursor-pointer border border-slate-400 bg-slate-100 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-100 rounded-lg"
            @click="appendValue(1)">1
          </div>
          <div
            class="flex items-center justify-center text-lg cursor-pointer border border-slate-400 bg-slate-100 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-100 rounded-lg"
            @click="appendValue(2)">2
          </div>
          <div
            class="flex items-center justify-center text-lg cursor-pointer border border-slate-400 bg-slate-100 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-100 rounded-lg"
            @click="appendValue(3)">3
          </div>
          <div
            class="flex items-center justify-center text-lg cursor-pointer border border-slate-400 bg-slate-100 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-100 rounded-lg"
            @click="appendValue(4)">4
          </div>
          <div
            class="flex items-center justify-center text-lg cursor-pointer border border-slate-400 bg-slate-100 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-100 rounded-lg"
            @click="appendValue(5)">5
          </div>
          <div
            class="flex items-center justify-center text-lg cursor-pointer border border-slate-400 bg-slate-100 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-100 rounded-lg"
            @click="appendValue(6)">6
          </div>
          <div
            class="flex items-center justify-center text-lg cursor-pointer border border-slate-400 bg-slate-100 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-100 rounded-lg"
            @click="appendValue(7)">7
          </div>
          <div
            class="flex items-center justify-center text-lg cursor-pointer border border-slate-400 bg-slate-100 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-100 rounded-lg"
            @click="appendValue(8)">8
          </div>
          <div
            class="flex items-center justify-center text-lg cursor-pointer border border-slate-400 bg-slate-100 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-100 rounded-lg"
            @click="appendValue(9)">9
          </div>
          <div
            class="flex items-center justify-center text-lg cursor-pointer border border-slate-400 bg-slate-100 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-100 rounded-lg"
            @click="separator()">.
          </div>
          <div
            class="flex items-center justify-center text-lg cursor-pointer border border-slate-400 bg-slate-100 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-100 rounded-lg"
            @click="appendValue(0)">0
          </div>
          <div
            class="flex items-center justify-center text-lg cursor-pointer border border-slate-400 bg-slate-100 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-100 rounded-lg"
            @click="removeLastDigit()">{{ '<' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
