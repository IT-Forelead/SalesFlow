<script setup>
import { reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import { cleanObjectEmptyFields } from '../../mixins/utils'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import CModal from '../common/CModal.vue'
import { useI18n } from 'vue-i18n'
import { useWhiteListStore } from '../../store/whiteList.store.js'
import WhiteListService from '../../services/whiteList.service.js'

const { t } = useI18n()

const isLoading = ref(false)

const submitForm = reactive({
    ipAddress: '',
  
})

const clearForm = () => {
  submitForm.ipAddress = ''
}

const closeModal = () => {
  useModalStore().closeCreateWhiteListModal()
  clearForm()
}

const createWhiteList = () => {
  if (!submitForm.ipAddress) {
    toast.warning(t('plsEnterFullid'))
  } else {
    isLoading.value = true
    WhiteListService.addWhiteList(
      cleanObjectEmptyFields({
        ipAddress: submitForm.ipAddress,

      }),
    ).then(() => {
      toast.success(t('agentAddedSuccessfully'))
      isLoading.value = false
      WhiteListService.getWhiteList()
        .then((res) => {
          useWhiteListStore().clearStore()
          useWhiteListStore().setWhiteList(res)
          useWhiteListStore().renderkey += 1
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
  <CModal :is-open="useModalStore().isOpenCreateWhiteListModal" v-if="useModalStore().isOpenCreateWhiteListModal"
            @close=closeModal>
      <template v-slot:header>
        {{ $t('addWhiteList') }}
      </template>
      <template v-slot:body>
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <label for="firstname" class="text-base dark:text-white font-medium">
                {{ $t('nameWhiteList') }}
                <span class="text-red-500 mr-2">*</span>
              </label>
              <input ipAddress="firstname" type="text" v-model="submitForm.ipAddress"
                     class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                     :placeholder="t('enterNameWhiteList')">
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
        <button v-else @click="createWhiteList()" type="button"
                class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
          {{ $t('create') }}
        </button>
      </template>
  </CModal>
</template>

<style scoped></style>