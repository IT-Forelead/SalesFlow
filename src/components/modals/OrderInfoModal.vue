<script setup>
import OrderModal from '../common/OrderModal.vue'
import { useModalStore } from '../../store/modal.store'
import ImageIcon from '../../assets/icons/ImageIcon.vue'
import PrinterIcon from '../../assets/icons/PrinterIcon.vue'
import ArrowsUpLeftRightIcon from '../../assets/icons/ArrowsUpLeftRightIcon.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import CancelButton from '../buttons/CancelButton.vue'
import { useOrderStore } from '../../store/order.store'
import OrderService from '../../services/order.service'
import { computed, onMounted, ref, watch } from 'vue'
import useMoneyFormatter from '../../mixins/currencyFormatter'
import moment from 'moment'
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import SettingsService from '../../services/settings.service.js'

const API_URL = import.meta.env.VITE_CHEQUE_API_URL

const { t } = useI18n()

const renderKey = computed(() => orderStore.renderkey)

const orderStore = useOrderStore()
const qrCode = ref()

const currentPage = computed(() => {
  return orderStore.currentPage
})
const params = computed(() => {
  return orderStore.params
})

const selectedOrder = computed(() => {
  return orderStore.selectedOrder
})

const selectedProductIds = ref([])

const quantity = ref(0)

const isFromCashback = computed(() => {
  return orderStore.isFromCashback
})

onMounted(() => {
  SettingsService.getSettings()
    .then((res) => {
      if (res) {
        qrCode.value = res.qrCode
      }
    })
    .catch((err) => {
      console.error('Error fetching settings:', err)
    })
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

const isLoadingPrint = ref(false)
const isRefundLoading = ref(false)

async function printChaque(data) {
  await axios
    .post(API_URL + '/print', data)
    .then(async () => {
      console.log('Chaque printed')
    })
    .catch(() => {
      console.log('Chaque not printed')
    })
}

const printChaqueFunc = (id) => {
  isLoadingPrint.value = true
  OrderService.getOrderById(id).then((res) => {
    printChaque({
      cashier: res?.cashierFirstName + ' ' + res.cashierLastName,
      discount: res?.discountPercent ?? 0,
      discount_amount: res?.discountPrice ?? 0,
      final_price: res?.totalPrice,
      market: res?.marketName,
      paid: res?.paymentReceived,
      price: res?.initialPrice,
      qrCode: res?.qrCode,
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
      qrcode: window.location.origin + '/customer/order/' + res?.id,
    }).finally(() => {
      isLoadingPrint.value = false
    })
  })
}

const zIndexVal = ref(2000)
const closeModal = () => {
 // useModalStore().openDebtInfoModal()
  selectedProductIds.value = []
  useModalStore().closeOrderInfoModal()
  useOrderStore().setSelectedOrder({})
}

const closeModalWithRefresh = () => {
 // useModalStore().openDebtInfoModal()
  selectedProductIds.value = []
  useModalStore().closeOrderInfoModal()
  useOrderStore().setSelectedOrder({})
  
  OrderService.getOrders( currentPage.value , 50, {...params.value} )
    .then((res) => {
      useOrderStore().clearStore()
      useOrderStore().totalOrders = res.total
      useOrderStore().setOrders(res.data)
      
    })
}

const refundSum = ref(0)

const toggleProductSelection = (item) => {
  if (selectedProductIds.value.includes(item.id)) {
    selectedProductIds.value = selectedProductIds.value.filter((productId) => productId !== item.id)
    refundSum.value = item.price
    quantity.value += item.amount
    selectedOrder.value.initialPrice += item.price

  } else {
    selectedProductIds.value.push(item.id)
    refundSum.value = item.price * (-1)
    quantity.value -= item.amount
    selectedOrder.value.initialPrice -= item.price
  }
}

watch(
  () => selectedProductIds.value,
  () => {
    
    const totalPrice = selectedOrder.value.totalPrice
    const paymentReceived = selectedOrder.value.paymentReceived

    
    
    const refundSumWithDiscount = selectedOrder.value.discountPercent > 0 ? refundSum.value - (refundSum.value * selectedOrder.value.discountPercent) / 100 : 0    
    
    selectedOrder.value.paymentReceived = paymentReceived + refundSumWithDiscount 
    
    selectedOrder.value.totalPrice = totalPrice + refundSumWithDiscount
    
    selectedOrder.value.discountPrice = selectedOrder.value.discountPercent > 0 ? selectedOrder.value.initialPrice - selectedOrder.value.totalPrice : 0

    
  },
  { deep: true },
);

watch(
  () => selectedOrder.value.items,
  () => {
    if (selectedOrder.value.items) {
    quantity.value = selectedOrder.value.items.filter(i => !i.refunded).reduce((acc, cur) => acc + cur.amount, 0)
    selectedOrder.value.initialPrice = selectedOrder.value.items.filter(i => !i.refunded).reduce((acc, cur) => acc + cur.price, 0)
    } else {
      quantity.value = 0
    }
  },
  { deep: true },
);

watch(
  () => selectedOrder.value.initialPrice,
  () => {
    selectedOrder.value.discountPrice = selectedOrder.value.discountPercent > 0 ? selectedOrder.value.initialPrice - selectedOrder.value.totalPrice : 0
  }
)

//
const refundProducts = () => {
  if (selectedProductIds.value.length == 0) {
    toast.error(t('errorWhileRefunding'))
  } else {
    isRefundLoading.value = true
    const orderId = selectedOrder.value.id
    const totalPrice = selectedOrder.value.totalPrice
    const paymentReceived = selectedOrder.value.paymentReceived
    OrderService.refundItems({
      orderId,
      totalPrice,
      paymentReceived,
      items: selectedProductIds.value,
    }).then(() => {
      selectedProductIds.value = []
      toast.success(t('refundedSuccessfully'))
      OrderService.getOrders( currentPage.value , 50, {...params.value} )
      .then((res) => {
        useOrderStore().clearStore()
        useOrderStore().totalOrders = res.total
        useOrderStore().setOrders(res.data)
      }).finally(() => {
        isRefundLoading.value = false
      })
      closeModal()
    }).catch((error) => {
      selectedProductIds.value = []
      console.error('Refund failed:', error)
      toast.error(t('errorWhileRefunding'))
    }).finally(() => {
      isRefundLoading.value = false
    })
  }
}
</script>

<template>
  <OrderModal :is-open="useModalStore().isOpenOrderInfoModal" v-if="useModalStore().isOpenOrderInfoModal" :zIndex ="zIndexVal"
          @close="closeModalWithRefresh" :key="renderKey">
    <template v-slot:header>
      {{ $t('salesDetails') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div v-if="selectedOrder?.items" class="inline-block md:min-w-full mb-1 align-middle">
          <div class="overflow-hidden overflow-y-scroll h-[300px] border-0">
            <table class="md:min-w-full text-sm">
              <thead>
              <tr class="bg-slate-100 font-medium text-gray-900">
                <th class="px-3 py-2 text-left rounded-l-xl text-sm md:text-base"></th>
                <th class="px-3 py-2 text-left text-sm md:text-base">{{ $t('product') }}</th>
                <th class="px-3 py-2 text-sm md:text-base">{{ $t('quantity') }}</th>
                <th class="px-3 py-2 text-sm md:text-base rounded-r-xl">{{ $t('totalPrice') }}</th>
              </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
              <tr
                v-for="(product, idx) in selectedOrder?.items"
                :key="idx"
                @click="!product.refunded && toggleProductSelection(product)"
                :class="{
                    'bg-blue-200 rounded-xl': selectedProductIds.includes(product.id) && !product.refunded,
                    'bg-red-200': product.refunded
                  }"
                class="cursor-pointer"
              >
                <td class="px-3 py-2 whitespace-nowrap">
                  <input type="checkbox" class="hidden" :disabled="product.refunded" />
                </td>
                <td class="px-3 py-2 whitespace-nowrap">
                  <div class="flex items-center space-x-3">
                    <div class="flex items-center justify-center bg-slate-100 md:w-12 md:h-12 w-8 h-8 rounded-lg">
                      <ImageIcon class="text-gray-500 w-6 h-6" />
                    </div>
                    <div>
                      <div class="text-sm md:text-base font-semibold text-gray-800">
                        {{ product?.productName + ' - ' + product?.packaging }}
                      </div>
                      <div class="text-sm md:text-base font-medium text-gray-500">
                        {{ $t('price') }}:
                        <span class="dark:text-white">
                            {{ useMoneyFormatter(product?.salePrice) }}
                          </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2 text-center whitespace-nowrap">
                  {{ product?.amount + ' ' + saleTypeShortTranslate(product?.saleType) }}
                </td>
                <td class="px-3 py-2 text-center whitespace-nowrap">
                  {{ useMoneyFormatter(product?.price) }}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <ul class="divide-y divide-slate-100">
          <li class="flex items-center justify-between py-1">
            <div class="text-base">
              {{ $t('numberOfProducts') }}
            </div>
            <div class="text-base font-medium">
              {{ quantity  + ' ' + $t('piece') }}
            </div>
          </li>
          
          <li  v-if="!isFromCashback" class="flex items-center justify-between py-2">
            <div class="text-base">
              {{ $t('price') }}
            </div>
            <div class="text-base font-medium">
              {{ useMoneyFormatter(selectedOrder?.initialPrice) }}
            </div>
          </li>
          <li v-if="!isFromCashback" class="flex items-center justify-between py-2">
            <div class="text-base">
              {{ $t('discount') }}
            </div>
            <div class="text-base font-medium">
              {{ selectedOrder?.discountPercent ?? 0 }} %
            </div>
          </li>
          <li class="flex items-center justify-between py-2">
            <div class="text-base">
              {{ $t('discountAmount') }}
            </div>
            <div class="text-base font-medium text-red-600">
              -{{ useMoneyFormatter(selectedOrder?.discountPrice) }}
            </div>
          </li>
          <li  v-if="!isFromCashback" class="flex items-center justify-between py-2">
            <div class="text-base">
              {{ $t('createdAt') }}
            </div>
            <div class="text-base font-medium">
              {{ moment(selectedOrder?.createdAt).format('DD/MM/YYYY H:mm') }}
            </div>
          </li>
          <li  v-if="!isFromCashback" class="flex items-center justify-between py-2">
            <div class="text-base">
              {{ $t('cashier') }}
            </div>
            <div class="text-base font-medium">
              {{ selectedOrder?.cashierFirstName + ' ' + selectedOrder?.cashierLastName }}
            </div>
          </li>
          <li v-if="!isFromCashback"  class="flex items-center justify-between py-2">
            <div class="text-base font-semibold text-gray-900">
              {{ $t('totalPrice') }}
            </div>
            <div class="text-lg font-semibold text-gray-900">
              {{ useMoneyFormatter(selectedOrder?.totalPrice) }}
            </div>
          </li>
          <li class="flex items-center justify-between py-2">
            <div class="text-base font-semibold text-gray-900">
              {{ $t('paymentReceived') }}
            </div>
            <div class="text-lg font-semibold text-gray-900" v-if="selectedOrder?.paymentReceived > 0">
              {{ useMoneyFormatter(selectedOrder?.paymentReceived) }}
            </div>
            <div class="text-lg font-semibold text-gray-900"  v-else >
              {{ useMoneyFormatter(0) }}
            </div>
          </li>
        </ul>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModalWithRefresh" />
      <div v-if="!isFromCashback" >
        
        <button v-if="isRefundLoading" type="button"
              class="inline-flex items-center justify-center ml-2 text-rose-500 dark:bg-slate-600 hover:bg-slate-100 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 hover:text-rose-600 focus:z-10">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-rose-500 animate-spin" />
        <span>{{ $t('refundItems') }}</span>
      </button>

      <button v-else type="button" @click="refundProducts"
              class="inline-flex items-center justify-center ml-2 text-rose-500 dark:bg-slate-600 hover:bg-slate-100 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 hover:text-rose-600 focus:z-10">
        <ArrowsUpLeftRightIcon class="mr-2 w-5 h-5" />
        <span>{{ $t('refundItems') }}</span>
      </button>

      <button v-if="isLoadingPrint" type="button"
              class="inline-flex items-center justify-center ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:dark:text-white fill-gray-600 dark:fill-gray-300" />
        <span>{{ $t('printOut') }}</span>
      </button>
      <button v-else @click="printChaqueFunc(selectedOrder?.id)" type="button"
              class="inline-flex items-center justify-center ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        <PrinterIcon class="mr-2 w-5 h-5 text-gray-200 dark:dark:text-white fill-gray-600 dark:fill-gray-300" />
        <span>{{ $t('printOut') }}</span>
      </button></div>
      
    </template>
  </OrderModal>
</template>

