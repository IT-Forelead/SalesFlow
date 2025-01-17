<script setup>
import CModal from '../common/CModal.vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useExpenseStore } from '../../store/expense.store.js'
import ExpenseService from '../../services/expense.service.js'

const expenseStore = useExpenseStore()
const { t } = useI18n()
const isLoading = ref(false)
const selectedExpense = computed(() => {
  return expenseStore.selectedExpense
})
const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}
const submitData = reactive({
  id: '',
  name: '',
  amount: '',
  startDate: '',
  endDate: '',
  paymentDate: '',
  intervalType: '',
  isActive: '',
})

const clearSubmitData = () => {
  submitData.id = ''
  submitData.name = ''
  submitData.amount = ''
  submitData.startDate = ''
  submitData.endDate = ''
  submitData.paymentDate = ''
  submitData.intervalType = ''
  submitData.isActive = ''
}

const closeModal = () => {
  useModalStore().closeEditExpenseModal()
  useExpenseStore().setSelectedExpense({})
  clearSubmitData()
}

const updateExpense = () => {
  if (!submitData.name) {
    toast.warning(t('enterExpense'))
  } else if (!submitData.amount) {
    toast.warning(t('enterExpenseAmount'))
  } else if (!submitData.startDate && selectedExpense.value.expenseType == 'repeated') {
    toast.warning(t('enterStartDate'))
  } else if (!submitData.endDate) {
    toast.warning(t('enterEndDate'))
  } else if (!submitData.paymentDate) {
    toast.warning(t('enterPaymentDate'))
  } else if (!submitData.intervalType && selectedExpense.value.expenseType == 'repeated') {
    toast.warning(t('enterIntervalType'))
  } else {
    isLoading.value = true
    ExpenseService.updateExpense({
      id: submitData.id,
      name: submitData.name,
      amount: submitData.amount,
      startDate: submitData.startDate,
      endDate: submitData.endDate,
      paymentDate: submitData.paymentDate,
      intervalType: submitData.intervalType,
      isActive: submitData.isActive,
    }).then((res) => {
      toast.success(t('expenseEditedSuccessfully'))
      ExpenseService.getExpenses
        ({
          limit: 10,
          page: 1,
        })
        .then((res) => {
          expenseStore.clearStore()
          expenseStore.setExpenses(res.data)
          expenseStore.renderkey += 1
        })
        .catch((err) => {
          toast.error(err.message)
        })
      isLoading.value = false
      closeModal()
    }).catch(() => {
      toast.error(t('errorWhileEditingExpense'))
      isLoading.value = false
      closeModal()
    })
  }
}

watch(
  () => selectedExpense.value,
  (data) => {
    if (data && useModalStore().isOpenEditExpenseModal) {
      submitData.id = data?.id;
      submitData.name = data?.name;
      submitData.amount = data?.amount;
      submitData.startDate = data?.startDate;
      submitData.endDate = data?.endDate;
      submitData.paymentDate = data?.paymentDate;
      submitData.intervalType = data?.intervalType;
      submitData.isActive = data?.isActive;
    }
  },
  { deep: true }
)
</script>

<template>
  <CModal :is-open="useModalStore().isOpenEditExpenseModal" v-if="useModalStore().isOpenEditExpenseModal"
    @close="closeModal">
    <template v-slot:header>
      {{ $t('editExpense') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="name" class="text-base dark:text-white font-medium">
              {{ $t('expenseName') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="name" type="text" v-model="submitData.name"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterExpense')">
          </div>
          <div class="flex-1">
            <label for="amount" class="text-base dark:text-white font-medium">
              {{ $t('expenseAmount') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <money3 v-bind="moneyConf"  id="amount" type="text" v-model.number="submitData.amount"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterExpenseAmount')"></money3>
          </div>
        </div>
        <div v-if="selectedExpense.expenseType == 'repeated'">
        <div class="flex items-center space-x-4">
          <div class="flex-1 space-y-1">
            <label for="price" class="text-base dark:text-white md:text-lg font-medium">
              {{ $t('productionDate') }}
            </label>
            <input id="quantity" type="date" v-model="submitData.productionDate"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
              :placeholder="t('enterProductQuantity')">
          </div>
          <div class="flex-1 space-y-1">
            <label for="price" class="text-base dark:text-white md:text-lg font-medium">
              {{ $t('expirationDate') }}
            </label>
            <input id="quantity" type="date" v-model="submitData.expirationDate"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg">
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1 space-y-1">
            <label for="price" class="text-base dark:text-white md:text-lg font-medium">
              {{ $t('paymentDate') }}
            </label>
            <input id="quantity" type="date" v-model="submitData.paymentDate"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg">
          </div>
          <div class="flex-1 space-y-1">
            <label for="interval-type" class="text-base dark:text-white md:text-lg font-medium">
              {{ $t('intervalType') }}
            </label>
            <select id="interval-type" v-model="submitData.intervalType"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg text-base md:text-lg block w-full h-11">
              <option value="day" selected>{{ $t('day') }}</option>
              <option value="week">{{ $t('week') }}</option>
              <option value="month">{{ $t('month') }}</option>
              <option value="year">{{ $t('year') }}</option>
            </select>
          </div>

        </div>
        <div class="w-1/2 flex items-center space-x-4">
          <div @click="handleIsActive"
            class="flex p-4 space-x-4 items-center border rounded-xl hover:bg-blue-100 dark:bg-slate-700 dark:hover:bg-slate-700 dark:text-slate-100 cursor-pointer w-full">
            <input type="checkbox" id="isActive" v-model="submitData.isActive" class="rounded" />
            <label class="w-fit cursor-pointer" id="isActive">{{ $t('isActive') }}</label>
          </div>
        </div>
      </div>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
      <button v-if="isLoading" type="button"
        class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
        {{ $t('save') }}
      </button>
      <button v-else @click="updateExpense()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('save') }}
      </button>
    </template>
  </CModal>
</template>
