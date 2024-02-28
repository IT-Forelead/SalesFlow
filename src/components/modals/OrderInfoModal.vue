<script setup>
import CModal from '../common/CModal.vue'
import { useModalStore } from '../../store/modal.store'
import ImageIcon from '../../assets/icons/ImageIcon.vue'
import CancelButton from '../buttons/CancelButton.vue'
import { useOrderStore } from '../../store/order.store';
import { computed } from 'vue';
import useMoneyFormatter from '../../mixins/currencyFormatter';
import moment from 'moment'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const orderStore = useOrderStore()

const selectedOrder = computed(() => {
  return orderStore.selectedOrder
})

const saleTypeShortTranslate = (type) => {
  switch (type){
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

const closeModal = () => {
  useModalStore().closeOrderInfoModal()
  useOrderStore().setSelectedOrder({})
}
</script>

<template>
  <CModal :is-open="useModalStore().isOpenOrderInfoModal" v-if="useModalStore().isOpenOrderInfoModal" @close=closeModal>
    <template v-slot:header>
      {{ $t('salesDetails') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div v-if="selectedOrder?.items" class="inline-block md:min-w-full align-middle">
          <div class="overflow-hidden border-0">
            <table class="md:min-w-full">
              <thead>
                <tr class="bg-slate-100 font-medium text-gray-900">
                  <th class="px-3 py-2 text-left rounded-l-xl text-sm md:text-base">{{ $t('product') }}</th>
                  <th class="px-3 py-2 text-sm md:text-base">{{ $t('quantity') }}</th>
                  <th class="px-3 py-2 text-sm md:text-base rounded-r-xl">{{ $t('totalPrice') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(product, idx) in selectedOrder?.items" :key="idx">
                  <td class="px-3 py-2 whitespace-nowrap">
                    <div class="flex items-center space-x-3">
                      <div class="flex items-center justify-center bg-slate-100 md:w-12 md:h-12 w-8 h-8 rounded-lg">
                        <ImageIcon class="text-gray-500 w-6 h-6" />
                      </div>
                      <div>
                        <div class="text-sm md:text-base font-semibold text-gray-800">
                          {{ product?.productName + " - " + product?.packaging }}
                        </div>
                        <div class="text-sm md:text-base font-medium text-gray-500">
                          {{ $t('price') }}:
                          <span class="text-gray-700">
                            {{ useMoneyFormatter(product?.salePrice) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 py-2 text-center whitespace-nowrap">
                    {{ product?.amount + " " + saleTypeShortTranslate(product?.saleType) }}
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
          <li class="flex items-center justify-between py-2">
            <div class="text-base">
              {{ $t('numberOfProducts') }}
            </div>
            <div class="text-base font-medium">
              {{ selectedOrder?.items.length + " " + $t('piece') }}
            </div>
          </li>
          <li class="flex items-center justify-between py-2">
            <div class="text-base">
              {{ $t('price') }}
            </div>
            <div class="text-base font-medium">
              {{ useMoneyFormatter(selectedOrder?.initialPrice) }}
            </div>
          </li>
          <li class="flex items-center justify-between py-2">
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
          <li class="flex items-center justify-between py-2">
            <div class="text-base">
              {{ $t('createdAt') }}
            </div>
            <div class="text-base font-medium">
              {{ moment(selectedOrder?.createdAt).format('DD/MM/YYYY H:mm') }}
            </div>
          </li>
          <li class="flex items-center justify-between py-2">
            <div class="text-base">
              {{ $t('cashier') }}
            </div>
            <div class="text-base font-medium">
              {{ selectedOrder?.cashierFirstName + " " + selectedOrder?.cashierLastName }}
            </div>
          </li>
          <li class="flex items-center justify-between py-2">
            <div class="text-lg font-semibold text-gray-900">
              {{ $t('totalPayment') }}
            </div>
            <div class="text-xl font-semibold text-gray-900">
              {{ useMoneyFormatter(selectedOrder?.totalPrice) }}
            </div>
          </li>
          <li class="flex items-center justify-between py-2">
            <div class="text-lg font-semibold text-gray-900">
              {{ $t('paymentReceived') }}
            </div>
            <div class="text-xl font-semibold text-gray-900">
              {{ useMoneyFormatter(selectedOrder?.paymentReceived) }}
            </div>
          </li>
        </ul>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
    </template>
  </CModal>
</template>

<style scoped></style>