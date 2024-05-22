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
import AgentService from '../../services/agent.service.js'
import { useAgentStore } from '../../store/agent.store.js'

const { t } = useI18n()
const phoneRegex = /\+998[1-9][\d]{8}/

const isLoading = ref(false)

const submitForm = reactive({
  fullName: '',
  phone: '',
  company: '',
})

const clearForm = () => {
  submitForm.fullName = ''
  submitForm.phone = ''
  submitForm.company = ''
}

const closeModal = () => {
  useModalStore().closeCreateAgentModal()
  clearForm()
}

const createAgent = () => {
  if (!submitForm.fullName) {
    toast.warning(t('plsEnterFullName'))
  } else if (!submitForm.phone) {
    toast.warning(t('plsEnterPhoneNumber'))
  } else if (submitForm.phone && !phoneRegex.test(submitForm.phone.replace(/([() -])/g, ''))) {
    toast.warning(t('plsEnterValidPhoneNumber'))
  } else if (!submitForm.company) {
    toast.warning(t('plsEnterCompany'))
  } else {
    isLoading.value = true
    AgentService.createAgent(
      cleanObjectEmptyFields({
        fullName: submitForm.fullName,
        company: submitForm.company,
        phone: submitForm.phone.replace(/([() -])/g, ''),
      }),
    ).then(() => {
      toast.success(t('agentAddedSuccessfully'))
      isLoading.value = false
      AgentService.getAgents()
        .then((res) => {
          useAgentStore().clearStore()
          useAgentStore().setAgents(res)
        })
    }).catch(() => {
      toast.error(t('errorWhileCreatingAgent'))
      isLoading.value = false
    })
    closeModal()
  }
}

</script>
<template>
  <div>
    <CModal :is-open="useModalStore().isOpenCreateAgentModal" v-if="useModalStore().isOpenCreateAgentModal"
            @close=closeModal>
      <template v-slot:header>
        {{ $t('createAgent') }}
      </template>
      <template v-slot:body>
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <label for="firstname" class="text-base font-medium">
                {{ $t('fullName') }}
                <span class="text-red-500 mr-2">*</span>
              </label>
              <input id="firstname" type="text" v-model="submitForm.fullName"
                     class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                     :placeholder="t('enterFullName')">
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <label for="company" class="text-base font-medium">
                {{ $t('company') }}
                <span class="text-red-500 mr-2">*</span>
              </label>
              <input id="company" type="text" v-model="submitForm.company"
                     class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                     :placeholder="t('enterCompany')">
            </div>
            <div class="flex-1">
              <label for="phone" class="text-base font-medium">
                {{ $t('phone') }}
                <span class="text-red-500 mr-2">*</span>
              </label>
              <input id="phone" type="text" v-model="submitForm.phone" v-maska data-maska="+998(##) ###-##-##"
                     class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                     placeholder="+998(00) 000-00-00">
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
        <button v-else @click="createAgent()" type="button"
                class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
          {{ $t('create') }}
        </button>
      </template>
    </CModal>
  </div>
</template>

<style scoped></style>