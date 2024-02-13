<script setup>
import CModal from '../common/CModal.vue'
import { reactive, ref } from 'vue'

import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store'
import CancelButton from '../buttons/CancelButton.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'

const isLoading = ref(false)


const closeModal = () => {
  useModalStore().closeCreateBarcodeModal()
  clearSubmitData()
}


</script>

<template>
  <CModal :is-open="useModalStore().isOpenCreateBarcodeModal" v-if="useModalStore().isOpenCreateBarcodeModal"
    @close="closeModal">
    <template v-slot:header> Shtrix kod yaratish </template>
    <template v-slot:body>
      <div class="space-y-4">
        
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
      <button v-else @click="createBarcode()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">Yaratish</button>
    </template>
  </CModal>
</template>

<style scoped></style>