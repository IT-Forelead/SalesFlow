<script setup>
import { reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import { cleanObjectEmptyFields } from '../../mixins/utils'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import CModal from '../common/CModal.vue'
import { useI18n } from 'vue-i18n'
import { useExpenseStore } from '../../store/expense.store.js'
import ExpenseService from '../../services/expense.service.js'

const { t } = useI18n()
const isLoading = ref(false)
const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}
const submitForm = reactive({
  name: '',
  amount: '',
  expenseType: '',
  startDate: '',
  endDate: '',
  paymentDate: '',
  intervalType: '',
})

const clearForm = () => {
  submitForm.name = ''
  submitForm.amount = ''
  submitForm.expenseType = ''
  submitForm.startDate = ''
  submitForm.endDate = ''
  submitForm.paymentDate = ''
  submitForm.intervalType = ''
}

const closeModal = () => {
  useModalStore().closeCreateExpenseModal()
  clearForm()
}

const createExpense = () => {
  if (!submitForm.name) {
    toast.warning(t('plsEnterExpense'))
  } else if (!submitForm.amount) {
    toast.warning(t('plsEnterExpenseAmount'))
  } else if (!submitForm.expenseType) {
    toast.warning(t('plsEnterExpenseType'))
  } else if (!submitForm.startDate && submitForm.expenseType == 'repeated') {
    toast.warning(t('plsEnterStartDate'))
  } else if (!submitForm.endDate && submitForm.expenseType == 'repeated') {
    toast.warning(t('plsEnterEndDate'))
  } else if (!submitForm.paymentDate && submitForm.expenseType == 'repeated') {
    toast.warning(t('plsEnterPaymentType'))
  } else if (!submitForm.intervalType && submitForm.expenseType == 'repeated') {
    toast.warning(t('plsEnterIntervalType'))
  } else {
    isLoading.value = true
    ExpenseService.createExpense(
      cleanObjectEmptyFields({
        name: submitForm.name,
        amount: submitForm.amount,
        expenseType: submitForm.expenseType,
        startDate: submitForm.startDate,
        endDate: submitForm.endDate,
        paymentDate: submitForm.paymentDate,
        intervalType: submitForm.intervalType,
      }),
    ).then(() => {
      toast.success(t('expenseAddedSuccessfully'))
      isLoading.value = false
      ExpenseService.getExpenses
        ({
          limit: 10,
          page: 1,
        })
        .then((res) => {
          useExpenseStore().clearStore()
          useExpenseStore().setExpenses(res.data)
          useExpenseStore().renderkey += 1
        })
    }).catch(() => {
      toast.error(t('errorWhileCreatingExpense'))
      isLoading.value = false
    })
    closeModal()
  }
}
</script>

<template>
  <CModal :is-open="useModalStore().isOpenCreateExpenseModal" v-if="useModalStore().isOpenCreateExpenseModal"
    @close=closeModal>
    <template v-slot:header>
      {{ $t('createExpense') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="name" class="text-base dark:text-white font-medium">
              {{ $t('expenseName') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="name" type="text" v-model="submitForm.name"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterExpense')">
          </div>
          <div class="flex-1">
            <label for="amount" class="text-base dark:text-white font-medium">
              {{ $t('expenseAmount') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <money3 v-bind="moneyConf"  id="amount" type="text" v-model.number="submitForm.amount"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterExpenseAmount')"></money3>
          </div>
        </div>
        <div class="w-full flex items-center space-x-4">
          <div class="w-1/2 space-y-1">
            <label for="expenseType" class="text-base dark:text-white md:text-lg font-medium">
              {{ $t('expenseType') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <select id="expenseType" v-model="submitForm.expenseType"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg block w-full h-11">
              <option value="one_time">{{ $t('oneTime') }}</option>
              <option value="repeated">{{ $t('repeated') }}</option>
            </select>
          </div>
          <div v-if="submitForm.expenseType === 'repeated'" class="flex-1 space-y-1">
            <label for="startDate" class="text-base dark:text-white md:text-lg font-medium">
              {{ $t('startDate') }}
            </label>
            <input id="startDate" type="date" v-model="submitForm.startDate"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg">
          </div>
        </div>
        <div v-if="submitForm.expenseType === 'repeated'" class="flex items-center space-x-4">
          <div class="flex-1 space-y-1">
            <label for="endDate" class="text-base dark:text-white md:text-lg font-medium">
              {{ $t('endDate') }}
            </label>
            <input id="endDate" type="date" v-model="submitForm.endDate"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg">
          </div>
          <div class="flex-1 space-y-1">
            <label for="paymentDate" class="text-base dark:text-white md:text-lg font-medium">
              {{ $t('paymentDate') }}
            </label>
            <input id="paymentDate" type="date" v-model="submitForm.paymentDate"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg">
          </div>
        </div>
        <div v-if="submitForm.expenseType === 'repeated'" class="w-1/2 flex items-center space-x-4">
          <div class="flex-1 space-y-1">
            <label for="interval-type" class="text-base dark:text-white md:text-lg font-medium">
              {{ $t('intervalType') }}
            </label>
            <select id="interval-type" v-model="submitForm.intervalType"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg text-base md:text-lg block w-full h-11">
              <option value="day">{{ $t('day') }}</option>
              <option value="week">{{ $t('week') }}</option>
              <option value="month">{{ $t('month') }}</option>
              <option value="year">{{ $t('year') }}</option>
            </select>
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
      <button v-else @click="createExpense()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('create') }}
      </button>
    </template>
  </CModal>
</template>

<style scoped></style>