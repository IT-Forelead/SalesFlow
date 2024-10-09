<script setup>
import { vMaska } from 'maska'
import { computed, reactive, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import UserService from '../../services/user.service.js'
import { useModalStore } from '../../store/modal.store.js'
import { useUserStore } from '../../store/user.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import CModal from '../common/CModal.vue'
import { useI18n } from 'vue-i18n'
import { useAgentStore } from '../../store/agent.store.js'
import AgentService from '../../services/agent.service.js'

const { t } = useI18n()

const isLoading = ref(false)
const agentStore = useAgentStore()

const selectedAgent = computed(() => {
  return agentStore.selectedAgent
})

const submitData = reactive({
  id: '',
  fullName: '',
  company: '',
  phone: '',
})

const clearSubmitData = () => {
  submitData.id = ''
  submitData.fullName = ''
  submitData.company = ''
  submitData.phone = ''
}

const closeModal = () => {
  useModalStore().closeEditAgentModal()
  useAgentStore().setSelectedAgent({})
  clearSubmitData()
}

const editAgent = () => {
  if (!submitData.fullName) {
    toast.warning(t('plsEnterFullName'))
  } else if (!submitData.phone) {
    toast.warning(t('plsEnterPhoneNumber'))
  } else if (submitData.phone.length !== 18) {
    toast.warning(t('plsEnterValidPhoneNumber'))
  } else if (!submitData.company) {
    toast.warning(t('plsEnterCompany'))
  } else {
    isLoading.value = true
    AgentService.updateAgent({
      id: submitData.id,
      fullName: submitData.fullName,
      company: submitData.company,
      phone: submitData.phone.replace(/([() -])/g, ''),
    }).then(() => {
      toast.success(t('agentEditedSuccessfully'))
      AgentService.getAgents()
        .then((res) => {
          agentStore.clearStore()
          agentStore.setAgents(res)
        })
        .catch((err) => {
          toast.error(err.message)
        })
      isLoading.value = false
      closeModal()
    }).catch(() => {
      toast.error(t('errorWhileEditingAgent'))
      isLoading.value = false
      closeModal()
    })
  }
}

watch(
  () => selectedAgent.value,
  (data) => {
    if (data) {
      submitData.id = data?.id
      submitData.fullName = data?.fullName
      submitData.company = data?.company
      submitData.phone = data?.phone
    }
  },
  { deep: true }
)
</script>
<template>
  <CModal :is-open="useModalStore().isOpenEditAgentModal" v-if="useModalStore().isOpenEditAgentModal" @close="closeModal">
    <template v-slot:header>
      {{ $t('editAgent') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="firstname" class="text-base font-medium">
              {{ $t('fullName') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="firstname" type="text" v-model="submitData.fullName"
                   class="bg-slate-100 border-none dark:text-white rounded-lg w-full py-2.5 placeholder-slate-400"
                   :placeholder="t('enterFullName')">
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="company" class="text-base font-medium">
              {{ $t('company') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="company" type="text" v-model="submitData.company"
                   class="bg-slate-100 border-none dark:text-white rounded-lg w-full py-2.5 placeholder-slate-400"
                   :placeholder="t('enterCompany')">
          </div>
          <div class="flex-1">
            <label for="phone" class="text-base font-medium">
              {{ $t('phone') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="phone" type="text" v-model="submitData.phone" v-maska data-maska="+998(##) ###-##-##"
                   class="bg-slate-100 border-none dark:text-white rounded-lg w-full py-2.5 placeholder-slate-400"
                   placeholder="+998(00) 000-00-00">
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
      <button v-else @click="editAgent()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('save') }}
      </button>
    </template>
  </CModal>
</template>
<style scoped></style>
