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
import InvestorService from '../../services/investor.service.js'
import { useInvestorStore } from '../../store/investor.store.js'
import EyeIcon from '@/assets/icons/EyeIcon.vue'
import EyeSlashIcon from '@/assets/icons/EyeSlashIcon.vue'

const { t } = useI18n()
const phoneRegex = /\+998[1-9][\d]{8}/
const hidePassword = ref(true)
const isLoading = ref(false)

const submitForm = reactive({
  fullName: '',
  phone: '',
  password: '',
})
const togglePassword = () => (hidePassword.value = !hidePassword.value)
const clearForm = () => {
  submitForm.fullName = ''
  submitForm.phone = ''
  submitForm.password = ''
  submitForm.confirmPassword = ''
}

const closeModal = () => {
  useModalStore().closeCreateInvestorModal()
  clearForm()
}

const createInvestor = () => {
  if (!submitForm.fullName) {
    toast.warning(t('plsEnterFullName'))
  } else if (!submitForm.phone) {
    toast.warning(t('plsEnterPhoneNumber'))
  } else if (submitForm.phone && !phoneRegex.test(submitForm.phone.replace(/([() -])/g, ''))) {
    toast.warning(t('plsEnterValidPhoneNumber'))
  } else if (!submitForm.password) {
    toast.warning(t('plsEnterPassword'))
  } else if (!submitForm.confirmPassword) {
    toast.warning(t('plsRepeatThePassword'))
  } else if (submitForm.password !== submitForm.confirmPassword) {
    toast.warning(t('passwordsDidNotMatch'))
  } else {
    isLoading.value = true
    InvestorService.createInvestor(
      cleanObjectEmptyFields({
        fullName: submitForm.fullName,
        phone: submitForm.phone.replace(/([() -])/g, ''),
        password: submitForm.password,
        confirmPassword: submitForm.confirmPassword,
      }),
    ).then(() => {
      toast.success(t('investorAddedSuccessfully'))
      isLoading.value = false
      InvestorService.getInvestorsByFilter({})
        .then((res) => {
          useInvestorStore().clearStore()
          useInvestorStore().setInvestors(res.data)
          useInvestorStore().renderkey += 1
        })
    }).catch(() => {
      toast.error(t('thisPhoneNumberAlreadyExist'))
      isLoading.value = false
    })
    closeModal()
  }
}

</script>
<template>
  <CModal :is-open="useModalStore().isOpenCreateInvestorModal" v-if="useModalStore().isOpenCreateInvestorModal"
    @close=closeModal>
    <template v-slot:header>
      {{ $t('createInvestor') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="fullname" class="text-base dark:text-white font-medium">
              {{ $t('fullName') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="fullname" type="text" v-model="submitForm.fullName"
              class="bg-slate-100 border-none rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterFullName')">
          </div>

        </div>
        <div class="flex items-center space-x-4">

          <div class="flex-1">
            <label for="phone" class="text-base dark:text-white font-medium">
              {{ $t('phone') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="phone" type="text" v-model="submitForm.phone" v-maska data-maska="+998(##) ###-##-##"
              class="bg-slate-100 border-none rounded-lg w-full py-2.5 placeholder-slate-400"
              placeholder="+998(00) 000-00-00">
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="password" class="text-base dark:text-white font-medium">
              {{ $t('password') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <div class="relative">
              <input v-model="submitForm.password" id="password" :type="hidePassword ? 'password' : 'text'"
                class="bg-slate-100 border-none rounded-lg w-full py-2.5 placeholder-slate-400"
                :placeholder="t('enterPassword')">
              <EyeIcon v-if="hidePassword" @click="togglePassword()"
                class="dark:text-zinc-300 dark:text-zinc-300 absolute z-10 top-1/2 -translate-y-1/2 right-3 w-5 h-5 cursor-pointer" />
              <EyeSlashIcon v-else @click="togglePassword()"
                class="dark:text-zinc-300 dark:text-zinc-300 absolute z-10 top-1/2 -translate-y-1/2 right-3 w-5 h-5 cursor-pointer" />
            </div>
          </div>
          <div class="flex-1">
            <label for="confirm-password" class="text-base dark:text-white font-medium">
              {{ $t('confirmPassword') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <div class="relative">
              <input v-model="submitForm.confirmPassword" id="confirm-password"
                :type="hidePassword ? 'password' : 'text'"
                class="bg-slate-100 border-none rounded-lg w-full py-2.5 placeholder-slate-400"
                :placeholder="t('enterThePasswordAgain')">
              <EyeIcon v-if="hidePassword" @click="togglePassword()"
                class="dark:text-zinc-300 dark:text-zinc-300 absolute z-10 top-1/2 -translate-y-1/2 right-3 w-5 h-5 cursor-pointer" />
              <EyeSlashIcon v-else @click="togglePassword()"
                class="dark:text-zinc-300 dark:text-zinc-300 absolute z-10 top-1/2 -translate-y-1/2 right-3 w-5 h-5 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
      <button v-if="isLoading" type="bSearchIconutton"
        class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-white fill-gray-600 dark:fill-gray-300" />
        {{ $t('create') }}
      </button>
      <button v-else @click="createInvestor()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('create') }}
      </button>
    </template>
  </CModal>
</template>

<style scoped></style>