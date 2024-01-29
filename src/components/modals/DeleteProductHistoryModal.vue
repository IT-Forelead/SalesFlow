<script setup>
import { useModalStore } from '../../store/modal.store.js'
import CModal from '../common/CModal.vue'
import moment from 'moment/moment.js'
import { useProductHistoryStore } from '../../store/productHistory.store.js'
import { computed } from 'vue'
import WarningCircleBoldIcon from '../../assets/icons/WarningCircleBoldIcon.vue'
import useMoneyFormatter from '../../mixins/currencyFormatter.js'
import { useProductStore } from '../../store/product.store.js'

const productStore = useProductStore()
const productHistoryStore = useProductHistoryStore()
const selectedProductHistory = computed(() => {
  return productHistoryStore.selectedProductHistory
})
const getHistoryType = (historyType) => {
  switch (historyType){
    case 'purchased':
      return 'Sotib olingan'
    case 'returned':
      return 'Qaytarilgan'
    default:
      return "Turi yo'q"
  }
}
const getProductName = (productId) => {
  const product = productStore.products.find(product => product.id === productId);
  return product?.name + " - " + product?.packaging || 'Mahsulot nomi yo\'q';
};

const closeModal = () => {
  useModalStore().closeDeleteProductHistoryModal()
  useProductHistoryStore().setSelectedProductHistory({})

}
</script>

<template>
  <CModal
    :is-open="useModalStore().isOpenDeleteProductHistoryModal"
    v-if="useModalStore().isOpenDeleteProductHistoryModal"
    @close=closeModal
  >
    <template v-slot:header>
      Mahsulot tarixini o'chirish
    </template>
    <template v-slot:body>
      <div class="space-y-16">
        <div class="space-y-2">
          <div class="bg-slate-100 px-3 text-center py-2 text-lg font-medium rounded-xl">
            Mahsulot tarixi ma'lumotlari
          </div>
          <ul class="divide-y divide-slate-100">
            <li class="flex items-center justify-between py-2 px-3">
              <div class="text-base">
                Nomi
              </div>
              <div class="text-base font-medium">
                {{ getProductName(selectedProductHistory?.productId) }}
              </div>
            </li>
            <li class="flex items-center justify-between py-2 px-3">
              <div class="text-base">
                Miqdori
              </div>
              <div class="text-base font-medium">
                {{ selectedProductHistory?.quantity }}
              </div>
            </li>
            <li class="flex items-center justify-between py-2 px-3">
              <div class="text-base">
                Mahsulot tarixi turi
              </div>
              <div class="text-base font-medium">
                {{ getHistoryType(selectedProductHistory?.historyType) }}
              </div>
            </li>
            <li class="flex items-center justify-between py-2 px-3">
              <div class="text-base">
                Sotib olingan narxi
              </div>
              <div class="text-base font-medium">
                {{ useMoneyFormatter(selectedProductHistory?.purchasePrice) }}
              </div>
            </li>
            <li class="flex items-center justify-between py-2 px-3">
              <div class="text-base">
                Sotish narxi
              </div>
              <div class="text-base font-medium">
                {{ useMoneyFormatter(selectedProductHistory?.salePrice) }}
              </div>
            </li>
            <li class="flex items-center justify-between py-2 px-3">
              <div class="text-base">
                Yaratilgan vaqti
              </div>
              <div class="text-base font-medium">
                {{ moment(selectedProductHistory?.createdAt).format('DD/MM/YYYY H:mm') }}
              </div>
            </li>
          </ul>
        </div>
        <div class="flex items-center justify-center">
          <div class="py-8 border border-red-300 rounded-2xl w-2/3">
            <div class="flex flex-col items-center space-y-4">
              <WarningCircleBoldIcon class="text-slate-400 w-14 h-14" />
              <h3 class="mb-5 text-lg text-justify font-normal text-slate-500">
                Haqiqatdan ushbu do'konni o'chirmoqchimisiz?
              </h3>
              <div class="flex items-center space-x-4">
                <button type="button" @click="closeModal()"
                        class="py-2 px-4 rounded-xl text-gray-900 text-base font-medium bg-slate-50 cursor-pointer hover:bg-slate-200 border">
                  Yo'q
                </button>
                <button
                  class="py-2 px-4 rounded-xl text-white text-base font-medium bg-red-600 cursor-pointer hover:bg-red-700">
                  Ha, albatta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CModal>
</template>