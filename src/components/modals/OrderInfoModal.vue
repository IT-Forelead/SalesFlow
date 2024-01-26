<script setup>
import CModal from '../common/CModal.vue'
import { useModalStore } from '../../store/modal.store'
import ImageIcon from '../../assets/icons/ImageIcon.vue'
import CancelButton from '../buttons/CancelButton.vue'
import { useOrderStore } from '../../store/order.store';
import { computed } from 'vue';
import useMoneyFormatter from '../../mixins/currencyFormatter';
import moment from 'moment'

const orderStore = useOrderStore()

const selectedOrder = computed(() => {
  return orderStore.selectedOrder
})

const closeModal = () => {
  useModalStore().closeOrderInfoModal()
  useOrderStore().setSelectedOrder({})
}
</script>

<template>
  <CModal :is-open="useModalStore().isOpenOrderInfoModal" v-if="useModalStore().isOpenOrderInfoModal" @close=closeModal>
    <template v-slot:header>
      Sotuv tafsilotlari
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div v-if="selectedOrder?.items" class="inline-block min-w-full align-middle">
          <div class="overflow-hidden border-0">
            <table class="min-w-full">
              <thead>
                <tr class="bg-slate-100 text-base font-medium text-gray-900">
                  <th class="px-3 py-2 text-left rounded-l-xl">Mahsulot</th>
                  <th class="px-3 py-2 text-center">Miqdori</th>
                  <th class="px-3 py-2 text-center rounded-r-xl">Jami narxi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(product, idx) in selectedOrder?.items" :key="idx">
                  <td class="px-3 py-2 whitespace-nowrap">
                    <div class="flex items-center space-x-3">
                      <div class="flex items-center justify-center bg-slate-100 w-12 h-12 rounded-lg">
                        <ImageIcon class="text-gray-500 w-8 h-8" />
                      </div>
                      <div>
                        <div class="text-base font-semibold text-gray-800">
                          {{ product?.name + " - " + product?.packaging }}
                        </div>
                        <div class="text-base font-medium text-gray-500">
                          Narxi:
                          <span class="text-gray-700">
                            {{ useMoneyFormatter(product?.price) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 py-2 text-center whitespace-nowrap">
                    {{ product?.amount }} dona
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
              Mahsulotlar soni
            </div>
            <div class="text-base font-medium">
              {{ selectedOrder?.items.length }} ta
            </div>
          </li>
          <li class="flex items-center justify-between py-2">
            <div class="text-base">
              Narxi
            </div>
            <div class="text-base font-medium">
              {{ useMoneyFormatter(selectedOrder?.initialPrice) }}
            </div>
          </li>
          <li class="flex items-center justify-between py-2">
            <div class="text-base">
              Chegirma
            </div>
            <div class="text-base font-medium">
              {{ selectedOrder?.discountPercent ?? 0 }} %
            </div>
          </li>
          <li class="flex items-center justify-between py-2">
            <div class="text-base">
              Chegirma miqdori
            </div>
            <div class="text-base font-medium text-red-600">
              -{{ useMoneyFormatter(selectedOrder?.discountPrice) }}
            </div>
          </li>
          <li class="flex items-center justify-between py-2">
            <div class="text-base">
              Vaqti
            </div>
            <div class="text-base font-medium">
              {{ moment(selectedOrder?.createdAt).format('DD/MM/YYYY H:mm') }}
            </div>
          </li>
          <li class="flex items-center justify-between py-2">
            <div class="text-base">
              Kassir
            </div>
            <div class="text-base font-medium">
              Jumaniyozov Suroj
            </div>
          </li>
          <li class="flex items-center justify-between py-2">
            <div class="text-lg font-semibold text-gray-900">
              Umumiy to'lov
            </div>
            <div class="text-xl font-semibold text-gray-900">
              {{ useMoneyFormatter(selectedOrder?.totalPrice) }}
            </div>
          </li>
          <li class="flex items-center justify-between py-2">
            <div class="text-lg font-semibold text-gray-900">
              Qabul qilingan to'lov
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