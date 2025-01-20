<script setup>
import { reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import { cleanObjectEmptyFields } from '../../mixins/utils'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import CModal from '../common/CModal.vue'
import { useI18n } from 'vue-i18n'
import { useInvestStore } from '../../store/invest.store.js'
import { useInvestorStore } from '../../store/investor.store.js'
import InvestService from '../../services/invest.service.js'
import InvestorService from '../../services/investor.service.js'
import { onMounted } from 'vue'
import moment from 'moment'

const { t } = useI18n()
const isLoading = ref(false)
const submitForm = reactive({
  investorId: '',
  investPlanId: '',
  activatedAt: moment().format('YYYY-MM-DD'),
})

const investors = ref([])
const investPlans = ref([])
const clearForm = () => {
  submitForm.investorId = ''
  submitForm.investPlanId = ''
  submitForm.activatedAt = moment().format('YYYY-MM-DD')
}

const closeModal = () => {
  useModalStore().closeCreateInvestModal()
  clearForm()
}

const createInvest = () => {
  if (!submitForm.investorId) {
    toast.warning(t('plsSelectInvestor'))
  } else if (!submitForm.investPlanId) {
    toast.warning(t('plsSelectInvestPlan'))
  } else if (!submitForm.activatedAt) {
    toast.warning(t('plsSelectActivatedDate'))
  } else {
    isLoading.value = true
    InvestService.createInvest(
      cleanObjectEmptyFields({
        investorId: submitForm.investorId,
        investPlanId: submitForm.investPlanId,
        activatedAt: submitForm.activatedAt,
      }),
    ).then(() => {
      toast.success(t('agentAddedSuccessfully'))
      isLoading.value = false
      InvestService.getInvests()
        .then((res) => {
          useInvestStore().clearStore()
          useInvestStore().setInvests(res)
          useInvestStore().renderkey += 1
        })
    }).catch(() => {
      toast.error(t('errorWhileCreatingAgent'))
      isLoading.value = false
    })
    closeModal()
  }
}

onMounted(() => {
  getInvestorsByFilter();
  getPlans()
});

const getInvestorsByFilter = async () => {
  const res = await InvestorService.getInvestorsByFilter({});
  useInvestorStore().clearStore();
  useInvestorStore().setInvestors(res.data);
};

const getPlans = async () => {
  const res = await InvestService.getPlans({});
  useInvestStore().clearStore();
  useInvestStore().setInvestPlans(res.data);
};
</script>

<template>
  <CModal :is-open="useModalStore().isOpenCreateInvestModal" v-if="useModalStore().isOpenCreateInvestModal"
    @close="closeModal">
    <template v-slot:header>
      {{ $t('createInvest') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="investor" class="text-base dark:text-white font-medium">
              {{ $t('investor') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <select id="investor" v-model="submitForm.investorId"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400">
              <option value=""></option>
              <option v-for="investor in useInvestorStore().investors" :key="investor.id" :value="investor.id">
                {{ investor?.fullName }}
              </option>
            </select>

            <label for="investPlan" class="text-base dark:text-white font-medium">
              {{ $t('investPlans') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <select id="investPlan" v-model="submitForm.investPlanId"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400">
              <option value=""></option>
              <option v-for="investPlan in useInvestStore().investPlans" :key="investPlan.id" :value="investPlan.id">
                {{ investPlan?.amount }}
              </option>
            </select>

            <label for="activatedAt" class="text-base dark:text-white font-medium">
              {{ $t('activatedAt') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input type="date" v-model="submitForm.activatedAt"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400" />
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
      <button v-else @click="createInvest()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('create') }}
      </button>
    </template>
  </CModal>
</template>

<style scoped></style>
