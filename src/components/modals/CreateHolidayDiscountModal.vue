<script setup>
import CModal from '../common/CModal.vue'
import { reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store'
import CancelButton from '../buttons/CancelButton.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import { useI18n } from 'vue-i18n'
import HolidayDiscountService from '../../services/holidayDiscount.service.js' // Import moment library
import { useHolidayDiscount } from '../../store/holidayDiscount.store.js'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import moment from 'moment'

const { t } = useI18n()

const isLoading = ref(false)
const submitData = reactive({
  percentage: null,
  quantity: null,
  from: '',
  to: '',
})

const clearSubmitData = () => {
  submitData.percentage = null
  submitData.quantity = null
  submitData.from = ''
  submitData.to = ''
}

const closeModal = () => {
  useModalStore().closeCreateHolidayDiscountModal()
  clearSubmitData()
}

const formatDate = (date) => {
  if (moment(date, 'DD/MM/YYYY', true).isValid()) {
    return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
  }
  return date
}

const createHolidayDiscount = () => {
  if (!submitData.percentage) {
    toast.warning(t('plsEnterPercentage'))
  } else if (!submitData.quantity) {
    toast.warning(t('plsEnterQuantity'))
  } else if (!submitData.from) {
    toast.warning(t('plsEnterFrom'))
  } else if (!submitData.to) {
    toast.warning(t('plsEnterTo'))
  } else {
    isLoading.value = true

    // Format the dates before sending
    const formattedFrom = formatDate(submitData.from)
    const formattedTo = formatDate(submitData.to)

    HolidayDiscountService.createHolidayDiscount({
      percentage: submitData.percentage,
      quantity: submitData.quantity,
      from: formattedFrom,
      to: formattedTo,
    }).then(() => {
      toast.success(t('holidayDiscountSuccessfullyAdded'))
      HolidayDiscountService.getHolidayDiscounts()
        .then((res) => {
          useHolidayDiscount().clearStore()
          useHolidayDiscount().setHolidayDiscounts(res)
        })
      isLoading.value = false
      closeModal()
    }).catch(() => {
      toast.error(t('errorWhileCreatingHolidayDiscount'))
      setTimeout(() => {
        isLoading.value = false
      }, 3000)
    })
  }
}
</script>

<template>
  <CModal :is-open="useModalStore().isOpenCreateHolidayDiscountModal" v-if="useModalStore().isOpenCreateHolidayDiscountModal"
          @close="closeModal">
    <template v-slot:header>
      {{ $t('addHolidayDiscount') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-2 mb-4">
          <div class="flex-1">
            <label for="price" class="text-base dark:text-white font-medium">
              {{ $t('holidayDiscountPercentage') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <InputNumber class="w-full bg-slate-100 rounded-lg"
                         input-class="bg-slate-100 h-11 p-3 border-none rounded-lg" v-model="submitData.percentage"
                         inputId="minmax" :min="0" :max="100" :placeholder="t('enterPercentage')" />
          </div>
          <div class="flex-1">
            <label for="quantity" class="text-base dark:text-white font-medium">
              {{ $t('quantity') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="quantity" type="number" v-model="submitData.quantity"
                   class="bg-slate-100 border-none dark:text-white rounded-lg w-full py-2.5 placeholder-slate-400"
                   :placeholder="t('enterQuantity')" />
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <div class="flex-1">
            <label for="from" class="text-base dark:text-white font-medium">
              {{ $t('from') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <Calendar class="w-full bg-slate-100 rounded-lg" input-class="bg-slate-100 border-none rounded-lg"
                      v-model="submitData.from" :date-format="'dd/mm/yy'" :placeholder="t('enterFrom')" />
          </div>
          <div class="flex-1">
            <label for="to" class="text-base dark:text-white font-medium">
              {{ $t('to') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <Calendar class="w-full bg-slate-100 rounded-lg" input-class="bg-slate-100 border-none rounded-lg"
                      v-model="submitData.to" :date-format="'dd/mm/yy'" :placeholder="t('enterTo')" />
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
      <button v-if="isLoading"
              class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-white fill-gray-600 dark:fill-gray-300" />
        {{ $t('create') }}
      </button>
      <button v-else @click="createHolidayDiscount()" type="button"
              class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('create') }}
      </button>
    </template>
  </CModal>
</template>
