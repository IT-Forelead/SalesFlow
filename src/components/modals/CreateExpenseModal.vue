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

const submitForm = reactive({
  name: '',
  amount: '',
  expenseType: '',
})

const clearForm = () => {
  submitForm.name = ''
  submitForm.amount = ''
  submitForm.expenseType = ''
}

const closeModal = () => {
  useModalStore().closeCreateExpenseModal()
  clearForm()
}

const createExpense = () => {
  if (!submitForm.name) {
    toast.warning(t('plsEnterFullName'))
  } else if (!submitForm.amount) {
    toast.warning(t('plsEnterFullName'))
  } else if (!submitForm.expenseType) {
    toast.warning(t('plsEnterFullName'))
  } else {
    isLoading.value = true
    ExpenseService.createExpense(
      cleanObjectEmptyFields({
        name: submitForm.name,
        amount: submitForm.amount,
        expenseType: submitForm.expenseType,

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
      {{ $t('addExpense') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="name" class="text-base dark:text-white font-medium">
              {{ $t('name') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="name" type="text" v-model="submitForm.name"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterName')">
          </div>

          <div class="flex-1">
            <label for="amount" class="text-base dark:text-white font-medium">
              {{ $t('amount') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="amount" type="text" v-model="submitForm.amount"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterAmount')">
          </div>

          <div class="flex-1">
            <label for="expenseType" class="text-base dark:text-white md:text-lg font-medium">
              {{ $t('expenseType') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <select id="expenseType" v-model="submitForm.expenseType"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg block w-full h-11">
              <option value="repeated" selected>{{ $t('repeated') }}</option>
              <option value="one_time">{{ $t('onetime') }}</option>
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