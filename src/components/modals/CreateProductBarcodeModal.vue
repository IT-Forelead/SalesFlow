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
  trademarkType: '',
})

const clearSubmitData = () => {
  submitData.trademark = ''
  submitData.packaging = ''
  submitData.barcode = ''
  submitData.trademarkType = ''
}

const closeModal = () => {
  useModalStore().closeCreateProductBarcodeModal()
  clearSubmitData()
}

const createProductBarcode = () => {
  if (!submitData.trademark) {
    toast.error("Savdo belgisini kiriting!")
  } else if (!submitData.packaging) {
    toast.error("Qadoqini kiriting!")
  } else if (!submitData.barcode) {
    toast.error("Shtrix kodni kiriting!")
  } else if (!submitData.trademarkType) {
    toast.error("Savdo turinini kiriting!")
  } else {
    isLoading.value = true
    // ProductBarcodeService.createProductBarcode({
    //   trademark: submitData.trademark,
    //   packaging: submitData.packaging,
    //   barcode: submitData.barcode,
    //   trademarkType: submitData.packaging,
    // }).then(() => {
    //   toast.success("Shtrix kod qo'shildi!")
    //   ProductBarcodeService.getBarcodes().then((res) => {
    //     useBarcodeStore().clearStore()
    //     useBarcodeStore().setBarcodes(res)
    //   })
    //   isLoading.value = false
    //   closeModal()
    // }).catch((err) => {
    //   toast.error("Do'kon yaratishda xatolik yuz berdi!")
    //   setTimeout(() => {
    //     isLoading.value = false
    //   }, 3000)
    // })
  }
}

</script>

<template>
  <CModal :is-open="useModalStore().isOpenCreateProductBarcodeModal" v-if="useModalStore().isOpenCreateProductBarcodeModal"
    @close="closeModal">
    <template v-slot:header> Shtrix kod yaratish </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="name" class="text-base font-medium">
              Savdo belgisi
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="name" type="text" v-model="submitData.trademark"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              placeholder="Savdo belgisini kiriting" />
          </div>
          <div class="flex-1">
            <label for="name" class="text-base font-medium">
              Qadoqi
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="name" type="text" v-model="submitData.packaging"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              placeholder="Qadoqini kiriting" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="name" class="text-base font-medium">
              Shtrix kodi
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="name" type="text" v-model="submitData.barcode"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              placeholder="Shtrix kodni kiriting" />
          </div>
          <div class="flex-1">
            <label for="name" class="text-base font-medium">
              Savdo turi
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="name" type="text" v-model="submitData.trademarkType"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              placeholder="Savdo turinini kiriting" />
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