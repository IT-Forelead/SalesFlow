<script setup>
import CModal from '../common/CModal.vue'
import { reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store'
import CancelButton from '../buttons/CancelButton.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import CustomerService from '../../services/customer.service'

const isLoading = ref(false)
const submitData = reactive({
  fullName: '',
  phone: '',
})

const clearSubmitData = () => {
  submitData.fullName = ''
  submitData.phone = ''
}

const closeModal = () => {
  useModalStore().closeCreateSaleModal()
  clearSubmitData()
}

const createSale = () => {
  if (!submitData.fullName) {
    toast.error('Famliya va ismini kiriting!')
  } else if (!submitData.phone) {
    toast.error('Telefon raqamni kiriting!')
  } else {
    CustomerService.createCustomer({
      fullName: submitData.fullName,
      phone: submitData.phone,
    }) 
      .then(() => {
        toast.success('Chegirma yaratildi!')
      })
      .catch((err) => {
        toast.error('Chegirma yaratishda xatolik yuz berdi!')
      })
  }
}
</script>

<template>
  <CModal :is-open="useModalStore().isOpenCreateSaleModal" v-if="useModalStore().isOpenCreateSaleModal" @close="closeModal">
    <template v-slot:header> Chegirma yaratish </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="fullName" class="text-base font-medium">
              Familiya va Ismi
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="fullName" type="text" v-model="submitData.fullName" class="bg-slate-100 border-none dark:text-white rounded-lg w-full py-2.5 placeholder-slate-400" placeholder="Famliya va ismini kiriting" />
          </div>
          <div class="flex-1">
            <label for="phone" class="text-base font-medium">
              Telefon raqam
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="phone" type="text" v-model="submitData.phone" class="bg-slate-100 border-none dark:text-white rounded-lg w-full py-2.5 placeholder-slate-400" placeholder="Telefon raqamni kiriting" />
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
      <button v-if="isLoading" type="bSearchIconutton" class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:dark:text-white fill-gray-600 dark:fill-gray-300" />
        Yaratish
      </button>
      <button v-else @click="createSale()" type="button" class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">Yaratish</button>
    </template>
  </CModal>
</template>

<style scoped></style>
