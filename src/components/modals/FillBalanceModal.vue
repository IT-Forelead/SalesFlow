<script setup>
import CModal from '../common/CModal.vue'
import { reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store'
import { useCustomerStore } from '../../store/customer.store'
import CancelButton from '../buttons/CancelButton.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import CustomerService from '../../services/customer.service'
import { useI18n } from 'vue-i18n'
import { useCorporateClientsStore } from '../../store/corporateClients.store'
import CorporateClientsService from '../../services/corporateClients.service.js'
import { Money3 } from 'v-money3'

const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

const { t } = useI18n()

const isLoading = ref(false)
const submitData = reactive({
  amount: '',
  reason: '',
})

const clearSubmitData = () => {
  submitData.amount = ''
  submitData.reason = ''
}

const closeModal = () => {
  useModalStore().closeFillBalanceModal()
  clearSubmitData()
}

const fillBalance = () => {
  if (!submitData.amount) {
    toast.warning(t('enterBalance'))
  } else if (!submitData.reason) {
    toast.warning(t('enterReason'))
  } else {
    isLoading.value = true
    CustomerService.fillBalance({
      customerId: useCorporateClientsStore().selectedClient.customerId,
      amount: submitData.amount,
      reason: submitData.reason,
    }).then(() => {
      toast.success(t('balanceFilled'))
      CorporateClientsService.getCorporateClients(30, 1)
      .then((response) => {
      useCorporateClientsStore().clearStore()
      useCorporateClientsStore().setCorporateClients(response)
      }).finally(() => {
      isLoading.value = false
      closeModal()
    })
    }).catch((err) => {
      toast.error(t('balanceError'))
      setTimeout(() => {
        isLoading.value = false
      }, 3000)
    })
  }
}
</script>

<template>
  <CModal :is-open="useModalStore().isOpenFillBalanceModal" v-if="useModalStore().isOpenFillBalanceModal"
    @close="closeModal">
    <template v-slot:header>
      {{ $t('fillBalance') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="amount" class="text-base font-medium">
              {{ $t('balance') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <money3 id="amount" type="text" v-bind="moneyConf" v-model="submitData.amount" class="border-none text-right dark:text-zinc-300 bg-slate-100 h-11 rounded-lg w-full text-lg">
              </money3>
          </div>
          <div class="flex-1">
            <label for="reason" class="text-base font-medium">
              {{ $t('reason') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="reason" type="text" v-model="submitData.reason"
               class="border-none dark:text-zinc-300 bg-slate-100 h-11 rounded-lg w-full text-lg"
              :placeholder="t('enterReason')" />
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
      <button v-if="isLoading" type="bSearchIconutton"
        class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:dark:text-white fill-gray-600 dark:fill-gray-300" />
        {{ $t('create') }}
      </button>
      <button v-else @click="fillBalance()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('create') }}
      </button>
    </template>
  </CModal>
</template>

<style scoped></style>