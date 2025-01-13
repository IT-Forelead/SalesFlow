<script setup>
import CModal from '../common/CModal.vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useOrderStore } from '../../store/order.store.js'
import OrderService from '../../services/order.service'

const orderStore = useOrderStore()
const { t } = useI18n()
const isLoading = ref(false)
const selectedOrder = computed(() => {
  return orderStore.selectedOrder
})

const submitData = reactive({
  orderId: '',
  paymentType: '',
})

const clearSubmitData = () => {
  submitData.orderId = ''
  submitData.paymentType = ''
}

const closeModal = () => {
  useModalStore().closeEditOrderModal()
  useOrderStore().setSelectedOrder({})
  clearSubmitData()
}

const updateOrder = () => {
  if (!submitData.paymentType) {
    toast.warning(t('plsEnterPaymentType'))
  } else {
    isLoading.value = true
    OrderService.updateOrder({
      orderId: selectedOrder.value.id,
      paymentType: submitData.paymentType
    }).then((res) => {
      toast.success(t('paymentEditedSuccessfully'))
      OrderService.getOrders( 1 , 50 , {})
        .then((res) => {
          orderStore.clearStore()
          orderStore.setOrders(res.data)
          orderStore.renderkey += 1
        })
        .catch((err) => {
          console.log(err.message)
          toast.error(err.message)
        })
      isLoading.value = false
      closeModal()
    }).catch(() => {
      toast.error(t('errorWhileEditingPayment'))
      isLoading.value = false
      closeModal()
    })
  }
}

watch(
  () => selectedOrder.value,
  (data) => {
    if (data && useModalStore().isOpenEditOrderModal) {
      submitData.orderId = data?.orderId;
      submitData.paymentType = data?.paymentType;
    }
  },
  { deep: true }
)

</script>
<template>
  <CModal :is-open="useModalStore().isOpenEditOrderModal" v-if="useModalStore().isOpenEditOrderModal"
    @close="closeModal">
    <template v-slot:header>
      {{ $t('editOrder') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="payment-type" class="text-base dark:text-white md:text-lg font-medium">
              {{ $t('paymentType') }}
            </label>
            <select id="payment-type" v-model="submitData.paymentType"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg text-base md:text-lg block w-full h-11">
              <option value="cash" selected>{{ $t('cash') }}</option>
              <option value="terminal">{{ $t('terminal') }}</option>
              <option value="click">{{ $t('click') }}</option>
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
      <button v-else @click="updateOrder()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('save') }}
      </button>
    </template>
  </CModal>
</template>
