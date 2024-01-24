<script setup>
import PhPencilLine from '../../assets/icons/EditIcon.vue'
import CModal from '../common/CModal.vue'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import SaveButton from '../buttons/SaveButton.vue'
import { ref } from 'vue'

const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

const money=ref({
  thousands: ' '
})
const closeModal = () => {
  useModalStore().closeEditProductHistoryModal()
}
</script>
<template>
  <div>
    <button
      type="button"
      @click="useModalStore().openEditProductHistoryModal()"
    >
      <PhPencilLine class="w-6 h-6 text-blue-600 hover:scale-105" />
    </button>
    <CModal
      :is-open="useModalStore().isOpenEditProductHistoryModal"
      v-if="useModalStore().isOpenEditProductHistoryModal"
      @close=closeModal
    >
      <template v-slot:header>
        Mahsulotni tarixini tahrirlash
      </template>
      <template v-slot:body>
        <div class="space-y-4">
          <div class="w-full mb-10">
            <div class="border-b border-gray-200 flex items-center justify-between">
              <p class="text-neutral-800 text-base font-normal">Mahsulot nomi</p>
              <h1 class="text-2xl font-semibold text-neutral-800 mt-2">
              Cola
              </h1>
            </div>
            <div class="py-4 border-b border-slate-200 flex items-center justify-between">
              <p class="text-neutral-800 text-base font-normal">Shtrix kod</p>
              <p class="text-sm leading-none text-gray-600">1212121</p>
            </div>
            <div class="py-4 border-b border-slate-200 flex items-center justify-between">
              <p class="text-neutral-800 text-base font-normal">Miqdori</p>
              <p class="text-sm leading-none text-gray-600 mr-3">12121</p>
            </div>
            <div class="py-4 border-b border-slate-200 flex items-center justify-between">
              <p class="text-neutral-800 text-base font-normal">Narxi</p>
              <p class="text-sm leading-none text-gray-600 mr-3">12112</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex-1 space-y-1">
              <label for="default-value"
                     class="block text-left mb-2 text-neutral-800 text-base font-normal after:text-red-500 after:content-['*']">
                Miqdori
              </label>
              <input id="default-value" type="text"
                     class="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5"
                     placeholder="Qiymatini kiriting">
            </div>
            <div class="flex-1 space-y-1">
              <label for="product-history-type"
                     class="block text-left mb-2 text-neutral-800 text-base font-normal after:text-red-500 after:content-['*']">
                Mahsulot tarixi turi
              </label>
              <select id="product-history-type"
                      class="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5">
                <option selected>Turini tanlang</option>
                <option value="purchased">Sotib olingan</option>
                <option value="returned">Qaytarilgan</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between space-x-4">
            <div class="flex-1 spaceSearchIcon-y-1">
              <label for="price" class="block text-left mb-2 text-neutral-800 text-base font-normal after:text-red-500 after:content-['*']">
                Sotib olingan narxi
              </label>
              <money3 id="price" v-bind="moneyConf" v-model.number="money.thousands"
                      class="bg-slate-50 text-right border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5">
              </money3>
            </div>
            <div class="flex-1 spaceSearchIcon-y-1">
              <label for="price" class="block text-left mb-2 text-neutral-800 text-base font-normal after:text-red-500 after:content-['*']">
                Sotuv narxi
              </label>
              <money3 id="price" v-bind="moneyConf" v-model.number="money.thousands"
                      class="bg-slate-50 text-right border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5">
              </money3>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <SaveButton/>
        <CancelButton @click="closeModal"/>
      </template>
    </CModal>
  </div>
</template>
<style scoped></style>