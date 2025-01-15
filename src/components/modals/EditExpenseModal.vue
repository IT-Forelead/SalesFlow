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

const submitData = reactive({
  id: '',
  name: '',
  amount: '',
  expenseType: '',
})

const clearSubmitData = () => {
  submitData.id = ''
  submitData.name = ''
  submitData.amount = ''
  submitData.expenseType = ''
}

const closeModal = () => {
  useModalStore().closeEditExpenseModal()
  useExpenseStore().setSelectedExpense({})
  clearSubmitData()
}

const updateExpense = () => {
  if (!submitData.name) {
    toast.warning(t('plsEnterExpense'))
  } else if (!submitData.amount) {
    toast.warning(t('plsEnterExpense'))
  } else if (!submitData.expenseType) {
    toast.warning(t('plsEnterExpense'))
  } else {
    isLoading.value = true

    ExpenseService.updateExpense({
      id: submitData.id,
      name: submitData.name,
      amount: submitData.amount,
      expenseType: submitData.expenseType
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
      submitData.expenseType = data?.expenseType;
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
            <label for="name" class="text-base dark:text-white md:text-lg font-medium">
              {{ $t('name') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="name" type="text" v-model="submitData.name"
              class="bg-slate-100 border-none text-slate-900 dark:text-white dark:bg-slate-700 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterProductName')" />
          </div>

          <div class="flex-1">
            <label for="amount" class="text-base dark:text-white md:text-lg font-medium">
              {{ $t('amount') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="amount" type="text" v-model="submitData.amount"
              class="bg-slate-100 border-none text-slate-900 dark:text-white dark:bg-slate-700 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterProductName')" />
          </div>

          <div class="flex-1">
            <label for="expenseType" class="text-base dark:text-white md:text-lg font-medium">
              {{ $t('expenseType') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <select id="expenseType" v-model="submitData.expenseType"
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
