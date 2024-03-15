<script setup>
import { vMaska } from 'maska'
import CancelButton from './buttons/CancelButton.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import CustomerService from '../services/customer.service.js'
import { reactive, ref } from 'vue'
import router from '../router/index.js'
const { t } = useI18n()

const props = defineProps({
  orderId: {
    type: String,
  },
  showDebtForm: {
    type: Boolean,
  },
  reFocusPhone: {
    type: Function
  },
  reFocusFullName: {
    type: Function
  }
})



const phoneRegex = /\+998[1-9][\d]{8}/;
const isLoadingDebtForm = ref(false)
const customerForm = reactive({
  fullName: '',
  phone: '',
})

const clearCustomerForm = () => {
  customerForm.fullName = ''
  customerForm.phone = ''
}

const closeForm = () => {
  props.showDebtForm.value = false
  clearCustomerForm()
}

const createDebtSale = () => {
  if (!customerForm.fullName) {
    toast.error(t('enterFullName'))
  } else if (!customerForm.phone) {
    toast.error(t('enterPhone'))
  } else if (customerForm.phone && !phoneRegex.test(customerForm.phone.replace(/([() -])/g, ''))) {
    toast.warning(t('plsEnterValidPhoneNumber'))
  } else {
    isLoadingDebtForm.value = true
    CustomerService.createCustomer({
      orderId: props.orderId,
      fullName: customerForm.fullName,
      phone: customerForm.phone.replace(/([() -])/g, ''),
    })
      .then(() => {
        isLoadingDebtForm.value = false
        closeForm()
        toast.success('Chegirma yaratildi!')
      })
      .catch((err) => {
        isLoadingDebtForm.value = false
        toast.error('Chegirma yaratishda xatolik yuz berdi!')
      })
  }
}
</script>

<template>
  <div class="flex flex-col space-y-8">
    <h3 class="text-xl font-semibold">{{ $t('addCustomer') }}</h3>
    <div>
      <div class="flex items-center space-x-4">
        <div class="flex-1">
          <label for="fullName" class="text-base font-medium">
            {{ $t('fullName') }}
            <span class="text-red-500 mr-2">*</span>
          </label>
          <input ref="onFullNameFocus"
                 @blur="props.reFocusFullName" id="fullName" type="text" v-model="customerForm.fullName" class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400" :placeholder="t('enterFullName')" />
        </div>
        <div class="flex-1">
          <label for="phone" class="text-base font-medium">
            {{ $t('phone') }}
            <span class="text-red-500 mr-2">*</span>
          </label>
          <input ref="onPhoneFocus"
                 @blur="props.reFocusPhone" id="phone" type="text" v-model="customerForm.phone" v-maska data-maska="+998(##) ###-##-##" class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400" placeholder="+998(00) 000-00-00" />
        </div>
      </div>
    </div>

    <div>
      <CancelButton @click="closeForm" />
      <button v-if="isLoadingDebtForm" class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
        {{ $t('create') }}
      </button>
      <button v-else @click="createDebtSale" type="button" class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">{{ $t('create') }}</button>
    </div>
  </div>
</template>

<style scoped>

</style>