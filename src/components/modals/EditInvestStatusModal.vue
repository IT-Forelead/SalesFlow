<script setup>
import { vMaska } from 'maska'
import { computed, reactive, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import CModal from '../common/CModal.vue'
import { useI18n } from 'vue-i18n'
import { useInvestStore } from '../../store/invest.store.js'
import InvestService from '../../services/invest.service.js'

const { t } = useI18n()
const isLoading = ref(false)
const investStore = useInvestStore()
const statuses = ["pending", "active", "rejected"]
const selectedInvest = computed(() => {
  return investStore.selectedInvest
})
const submitData = reactive({
  id: '',
})
const clearSubmitData = () => {
  submitData.id = ''
}
const closeModal = () => {
  useModalStore().closeEditInvestStatusModal()
  useInvestStore().setSelectedInvest({})
  clearSubmitData()
}
const editInvestStatus = () => {
  if (!selectedInvest.value.status) {
    toast.warning(t('plsEnterStatus'))
  } else {
    isLoading.value = true
    InvestService.changeStatus({
      id: selectedInvest.value.id,
      status: selectedInvest.value.status,
    }).then(() => {
      toast.success(t('investEditedSuccessfully'))
      InvestService.getInvestsByFilters({})
        .then((res) => {
          investStore.clearStore()
          investStore.setInvests(res.data)
          investStore.renderkey += 1
        })
        .catch((err) => {
          toast.error(err.message)
        })
      isLoading.value = false
      closeModal()
    }).catch(() => {
      toast.error(t('errorWhileEditingInvest'))
      isLoading.value = false
      closeModal()
    })
  }
}
const capitalize = (word) => {
  const [firstLetter, ...rest] = word.split('');
  const upperCaseLetter = firstLetter.toUpperCase();
  if (firstLetter === upperCaseLetter) {
    return;
  }
  return firstLetter.toUpperCase() + rest.join('');
}

watch(
  () => selectedInvest.value,
  (data) => {
    if (data) {
      submitData.id = data?.id
    }
  },
  { deep: true }
)
</script>

<template>
  <CModal :is-open="useModalStore().isOpenEditInvestStatusModal" v-if="useModalStore().isOpenEditInvestStatusModal"
    @close="closeModal">
    <template v-slot:header>
      {{ $t('editInvestStatus') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
              <label for="status" class="text-base font-medium">
                {{ $t('status') }}
                <span class="text-red-500 mr-2">*</span>
              </label>
              <select id="status" v-model="selectedInvest.status"
                class="bg-slate-100 border-none dark:text-white rounded-lg block w-full">
                <option value="" selected>{{ $t('selectStatus') }}</option>
                <option v-for="(status, idx) in statuses" :key="idx" :value="status">
                  {{ capitalize(status) }}
                </option>
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
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:dark:text-white fill-gray-600 dark:fill-gray-300" />
        {{ $t('save') }}
      </button>
      <button v-else @click="editInvestStatus()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('save') }}
      </button>
    </template>
  </CModal>
</template>

<style scoped></style>
