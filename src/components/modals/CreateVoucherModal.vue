<script setup>
import { vMaska } from 'maska'
import { reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import { cleanObjectEmptyFields } from '../../mixins/utils'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import CModal from '../common/CModal.vue'
import { useI18n } from 'vue-i18n'
import VoucherService from '../../services/voucher.service.js'
import { useVoucherStore } from '../../store/voucher.store.js'

const { t } = useI18n()
const isLoading = ref(false)

const submitForm = reactive({
  amount: 0,
  count: 0,
  expireDate: '',
})

const clearForm = () => {
  submitForm.amount = ''
  submitForm.count = ''
  submitForm.expireDate = ''
}

const closeModal = () => {
  useModalStore().closeCreateVoucherModal()
  clearForm()
}

const createVoucher = () => {
  if (!submitForm.amount) {
    toast.warning(t('plsEnterAmount'))
  
  } else if (!submitForm.count) {
    toast.warning(t('plsEnterCount'))
  } else if (!submitForm.expireDate) {
    toast.warning(t('plsEnterExpirationDate'))
  } else {
    isLoading.value = true
    VoucherService.createVoucher(
      cleanObjectEmptyFields({
        amount: submitForm.amount,
        count: submitForm.count,
        expireDate: submitForm.expireDate,
      }),
    ).then(() => {
      toast.success(t('voucherAddedSuccessfully'))
      isLoading.value = false
      VoucherService.getAllVouchers(30, 1)
        .then((res) => {
          useVoucherStore().clearStore()
          useVoucherStore().setVouchers(res.data)
          useVoucherStore().renderkey += 1
        })
    }).catch(() => {
      toast.error(t('errorWhileCreatingVoucher'))
      isLoading.value = false
    })
    closeModal()
  }
}

</script>
<template>
  <CModal :is-open="useModalStore().isOpenCreateVoucherModal" v-if="useModalStore().isOpenCreateVoucherModal"
            @close=closeModal>
      <template v-slot:header>
        {{ $t('addVoucher') }}
      </template>
      <template v-slot:body>
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <label for="firstname" class="text-base dark:text-white font-medium">
                {{ $t('amount') }}
                <span class="text-red-500 mr-2">*</span>
              </label>
              <input id="amount" type="number" v-model="submitForm.amount"
                     class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                     :placeholder="t('plsEnterAmount')">
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <label for="count" class="text-base dark:text-white font-medium">
                {{ $t('count') }}
                <span class="text-red-500 mr-2">*</span>
              </label>
              <input id="count" type="number" v-model="submitForm.count"
                     class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                     :placeholder="t('plsEnterCount')">
            </div>
            <div class="flex-1 space-y-1">
              <label for="expireDate" class="text-base dark:text-white md:text-lg font-medium">
                {{ $t('expirationDate') }}
              </label>
              <input id="expireDate" type="date" v-model="submitForm.expireDate"
                     class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg">
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <CancelButton @click="closeModal" />
        <button v-if="isLoading"
                class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
          <Spinners270RingIcon
            class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
          {{ $t('create') }}
        </button>
        <button v-else @click="createVoucher()" type="button"
                class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
          {{ $t('create') }}
        </button>
      </template>
  </CModal>
</template>

<style scoped></style>