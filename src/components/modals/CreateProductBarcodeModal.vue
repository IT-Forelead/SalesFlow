<script setup>
import CModal from '../common/CModal.vue'
import { reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store'
import CancelButton from '../buttons/CancelButton.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'

const isLoading = ref(false)
const submitData = reactive({
  trademark: '',
  packaging: '',
  barcode: '',
  saleType: '',
})

const clearSubmitData = () => {
  submitData.trademark = ''
  submitData.packaging = ''
  submitData.barcode = ''
  submitData.saleType = ''
}

const closeModal = () => {
  useModalStore().closeCreateProductBarcodeModal()
  clearSubmitData()
}

const createProductBarcode = () => {
  if (!submitData.trademark) {
    toast.error("Mahsulot nomini kiriting!")
  } else if (!submitData.packaging) {
    toast.error("Qadoqini kiriting!")
  } else if (!submitData.barcode) {
    toast.error("Shtrix kodini kiriting!")
  } else if (!submitData.saleType) {
    toast.error("Sotuv turinini kiriting!")
  } else {

  }
}

</script>

<template>
  <CModal :is-open="useModalStore().isOpenCreateProductBarcodeModal"
    v-if="useModalStore().isOpenCreateProductBarcodeModal" @close="closeModal">
    <template v-slot:header> Shtrix kod yaratish </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="trademark" class="text-base font-medium">
              Mahsulot nomi
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="trademark" type="text" v-model="submitData.trademark"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              placeholder="Savdo belgisini kiriting" />
          </div>
          <div class="flex-1">
            <label for="packaging" class="text-base font-medium">
              Qadoqi
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="packaging" type="text" v-model="submitData.packaging"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              placeholder="Qadoqini kiriting" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="barcode" class="text-base font-medium">
              Shtrix kodi
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="barcode" type="text" v-model="submitData.barcode"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              placeholder="Shtrix kodni kiriting" />
          </div>
          <div class="flex-1">
            <label for="sale-type" class="text-base font-medium">
              Sotuv turi
              <span class="text-red-500 mr-2">*</span>
            </label>
            <select id="sale-type" v-model="submitData.saleType"
              class="bg-slate-100 border-none text-slate-900 rounded-lg block w-full h-11">
              <option value="" selected>Turini tanlang</option>
              <option value="amount">Donali</option>
              <option value="kg">Kilogrammli</option>
              <option value="g">Gramli</option>
              <option value="litre">Litrli</option>
            </select>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
      <button v-if="isLoading" type="bSearchIconutton"
        class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
        Yaratish
      </button>
      <button v-else @click="createProductBarcode()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">Yaratish</button>
    </template>
  </CModal>
</template>

<style scoped></style>