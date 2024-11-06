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
import InvestService from '../../services/invest.service.js'
import MarketService from '../../services/market.service.js'
import { useInvestStore } from '../../store/invest.store.js'
import { watch } from 'vue'

const { t } = useI18n()
const markets = ref([])
const isLoading = ref(false)

const getMarkets = () => {
  MarketService.getMarkets()
    .then((res) => {
      markets.value = res
    })
}
watch(
  () => useModalStore().isOpenCreateInvestPlanModal,
  (data) => {
    if (data) {
      getMarkets()
    }
  },
  { deep: true }
)

const submitForm = reactive({
  marketId: '',
  amount: '',
  rate: '',
  availabilityCount: '',
})

const clearForm = () => {
  submitForm.marketId = ''
  submitForm.amount = ''
  submitForm.rate = ''
  submitForm.availabilityCount = ''
}

const closeModal = () => {
  useModalStore().closeCreateInvestPlanModal()
  clearForm()
}

const createPlan = () => {
  if (!submitForm.marketId) {
    toast.warning(t('plsEnterMarket'))
  } else if (!submitForm.amount) {
    toast.warning(t('plsEnterAmount'))
  } else if (!submitForm.rate) {
    toast.warning(t('plsEnterRate'))
  } else if (!submitForm.availabilityCount) {
    toast.warning(t('plsEnterAvailabilityCount'))
  } else {
    isLoading.value = true
    InvestService.createPlan(
      cleanObjectEmptyFields({
        marketId: submitForm.marketId,
        amount: submitForm.amount,
        rate: submitForm.rate,
        availabilityCount: submitForm.availabilityCount
      }),
    ).then(() => {
      toast.success(t('investPlanAddedSuccessfully'))
      isLoading.value = false
      InvestService.getPlans({})
        .then((res) => {
          useInvestStore().clearStore()
          useInvestStore().setInvestPlans(res.data)
          useInvestStore().renderkey += 1
        })
    }).catch(() => {
      toast.error(t('errorWhileCreatingInvestPlan'))
      isLoading.value = false
    })
    closeModal()
  }
}

</script>
<template>
  <CModal :is-open="useModalStore().isOpenCreateInvestPlanModal" v-if="useModalStore().isOpenCreateInvestPlanModal"
    @close=closeModal>
    <template v-slot:header>
      {{ $t('createPlan') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="market" class="text-base dark:text-white font-medium">
                {{ $t('store') }}
                <span class="text-red-500 mr-2">*</span>
              </label>
              <select id="market" v-model="submitForm.marketId"
                class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg  block w-full">
                <option value="" selected>{{ $t('selectStore') }}</option>
                <option v-for="(market, idx) in markets" :key="idx" :value="market?.id">
                  {{ market?.name }}
                </option>
              </select>
          </div>
          <div class="flex-1">
            <label for="amount" class="text-base dark:text-white font-medium">
              {{ $t('amount') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="amount" type="text" v-model="submitForm.amount"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400">
          </div>

        </div>
        <div class="flex items-center space-x-4">

          <div class="flex-1">
            <label for="rate" class="text-base dark:text-white font-medium">
              {{ $t('ratePercent') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="rate" type="text" v-model="submitForm.rate" 
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400">
          </div>
          <div class="flex-1">
            <label for="availabilityCount" class="text-base dark:text-white font-medium">
              {{ $t('availabilityCount') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="availabilityCount" type="text" v-model="submitForm.availabilityCount" 
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400">
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
      <button v-else @click="createPlan()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('create') }}
      </button>
    </template>
  </CModal>
</template>

<style scoped></style>